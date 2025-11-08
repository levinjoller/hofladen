CREATE OR REPLACE FUNCTION public.swap_paloxes_between_slots_fnc(p_slot_ids integer []) RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '' AS $$
DECLARE slot_a integer;

slot_b integer;

cnt_a integer;

cnt_b integer;

max_a integer;

max_b integer;

sorted_slots integer [];

BEGIN IF p_slot_ids IS NULL
OR array_length(p_slot_ids, 1) <> 2 THEN RAISE EXCEPTION 'p_slot_ids must contain exactly two slot IDs.' USING ERRCODE = 'YY011',
HINT = 'please check the number of slot IDs';

END IF;

SELECT ARRAY(
        SELECT unnest(p_slot_ids)
        ORDER BY 1
    ) INTO sorted_slots;

slot_a := sorted_slots [1];

slot_b := sorted_slots [2];

SELECT s1.max_level,
    s2.max_level INTO max_a,
    max_b
FROM public.stock_column_slots s1
    JOIN public.stock_column_slots s2 ON s2.id = slot_b
WHERE s1.id = slot_a FOR
UPDATE OF s1,
    s2;

IF NOT FOUND THEN RAISE EXCEPTION 'one of the two slot IDs (% / %) does not exist.',
slot_a,
slot_b USING ERRCODE = 'YY012',
HINT = 'please check the slot IDs';

END IF;

SELECT COALESCE(
        SUM(
            CASE
                WHEN scl.fk_stock_column_slot = slot_a THEN 1
                ELSE 0
            END
        ),
        0
    ),
    COALESCE(
        SUM(
            CASE
                WHEN scl.fk_stock_column_slot = slot_b THEN 1
                ELSE 0
            END
        ),
        0
    ) INTO cnt_a,
    cnt_b
FROM public.paloxes p
    JOIN public.stock_column_slot_levels scl ON scl.id = p.fk_stock_column_slot_level
WHERE scl.fk_stock_column_slot IN (slot_a, slot_b);

IF cnt_a = 0
AND cnt_b = 0 THEN RETURN;

END IF;

IF cnt_a > max_b THEN RAISE EXCEPTION 'slot with ID % (max % level) cannot store % paloxes.',
slot_b,
max_b,
cnt_a USING ERRCODE = 'YY013',
HINT = 'please add more levels to the slot or minimize the amount of paloxes to store.';

END IF;

IF cnt_b > max_a THEN RAISE EXCEPTION 'slot with ID% (max % level) cannot store % paloxes.',
slot_a,
max_a,
cnt_b USING ERRCODE = 'YY013',
HINT = 'please add more levels to the slot or minimize the amount of paloxes to store.';

END IF;

UPDATE public.paloxes p
SET fk_stock_column_slot_level = NULL
WHERE p.fk_stock_column_slot_level IN (
        SELECT id
        FROM public.stock_column_slot_levels
        WHERE fk_stock_column_slot = slot_b
    );

WITH paloxes_to_move AS (
    SELECT p.id,
        ROW_NUMBER() OVER (
            ORDER BY la.level
        ) AS rn
    FROM public.paloxes p
        JOIN public.stock_column_slot_levels la ON la.id = p.fk_stock_column_slot_level
    WHERE la.fk_stock_column_slot = slot_a
),
target_levels AS (
    SELECT id AS target_level_id,
        ROW_NUMBER() OVER (
            ORDER BY LEVEL
        ) AS rn
    FROM public.stock_column_slot_levels
    WHERE fk_stock_column_slot = slot_b
    LIMIT cnt_a
)
UPDATE public.paloxes p
SET fk_stock_column_slot_level = tl.target_level_id
FROM paloxes_to_move ptm
    JOIN target_levels tl ON tl.rn = ptm.rn
WHERE p.id = ptm.id;

WITH paloxes_to_move AS (
    SELECT p.id,
        ROW_NUMBER() OVER (
            ORDER BY p.id
        ) AS rn
    FROM public.paloxes p
    WHERE p.fk_stock_column_slot_level IS NULL
    LIMIT cnt_b
), target_levels AS (
    SELECT id AS target_level_id,
        ROW_NUMBER() OVER (
            ORDER BY LEVEL
        ) AS rn
    FROM public.stock_column_slot_levels
    WHERE fk_stock_column_slot = slot_a
    LIMIT cnt_b
)
UPDATE public.paloxes p
SET fk_stock_column_slot_level = tl.target_level_id
FROM paloxes_to_move ptm
    JOIN target_levels tl ON tl.rn = ptm.rn
WHERE p.id = ptm.id;

END;

$$;

ALTER FUNCTION public.swap_paloxes_between_slots_fnc(integer []) OWNER TO postgres;

REVOKE EXECUTE ON FUNCTION public.swap_paloxes_between_slots_fnc(integer [])
FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.swap_paloxes_between_slots_fnc(integer [])
FROM anon;

GRANT EXECUTE ON FUNCTION public.swap_paloxes_between_slots_fnc(integer []) TO authenticated;

GRANT EXECUTE ON FUNCTION public.swap_paloxes_between_slots_fnc(integer []) TO postgres;

GRANT EXECUTE ON FUNCTION public.swap_paloxes_between_slots_fnc(integer []) TO service_role;

CREATE OR REPLACE FUNCTION public.update_stored_at_taken_levels_after_palox_update_trg_fnc() RETURNS TRIGGER LANGUAGE 'plpgsql' COST 100 VOLATILE NOT LEAKPROOF SECURITY DEFINER -- Hinzugefügt: Stellt Superuser-Rechte bereit
SET search_path = '' AS $BODY$
DECLARE v_level_ids BIGINT [];

BEGIN
SELECT array_agg(fk_stock_column_slot_level) INTO v_level_ids
FROM (
        SELECT fk_stock_column_slot_level
        FROM new_paloxes
        UNION
        SELECT fk_stock_column_slot_level
        FROM old_paloxes
    ) AS combined
WHERE fk_stock_column_slot_level IS NOT NULL;

IF v_level_ids IS NOT NULL THEN PERFORM public.do_update_taken_levels_fnc(v_level_ids);

END IF;

RETURN NULL;

END;

$BODY$;

ALTER FUNCTION public.update_stored_at_taken_levels_after_palox_update_trg_fnc() OWNER TO postgres;

REVOKE EXECUTE ON FUNCTION public.update_stored_at_taken_levels_after_palox_update_trg_fnc()
FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.update_stored_at_taken_levels_after_palox_update_trg_fnc()
FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.update_stored_at_taken_levels_after_palox_update_trg_fnc()
FROM anon;

GRANT EXECUTE ON FUNCTION public.update_stored_at_taken_levels_after_palox_update_trg_fnc() TO postgres;

GRANT EXECUTE ON FUNCTION public.update_stored_at_taken_levels_after_palox_update_trg_fnc() TO service_role;

CREATE OR REPLACE FUNCTION public.do_update_taken_levels_fnc(p_affected_level_ids bigint []) RETURNS void LANGUAGE 'plpgsql' COST 100 VOLATILE PARALLEL UNSAFE AS $BODY$
DECLARE v_affected_slot_ids BIGINT [];

BEGIN
SELECT ARRAY_AGG(DISTINCT fk_stock_column_slot) INTO v_affected_slot_ids
FROM public.stock_column_slot_levels
WHERE id = ANY(p_affected_level_ids);

IF v_affected_slot_ids IS NULL THEN RETURN;

END IF;

WITH calculated_status AS (
    SELECT al.id,
        EXISTS (
            SELECT 1
            FROM public.paloxes p
            WHERE p.fk_stock_column_slot_level = al.id
        ) AS new_is_taken_status
    FROM public.stock_column_slot_levels al
    WHERE al.id = ANY(p_affected_level_ids)
)
UPDATE public.stock_column_slot_levels AS l
SET is_taken = cs.new_is_taken_status
FROM calculated_status cs
WHERE l.id = cs.id
    AND l.is_taken IS DISTINCT
FROM cs.new_is_taken_status;

UPDATE public.stock_column_slots scs
SET current_taken_levels = sub.cnt
FROM (
        SELECT scs_base.id AS fk_stock_column_slot,
            COALESCE(p_counts.cnt, 0) AS cnt
        FROM public.stock_column_slots scs_base
            LEFT JOIN (
                SELECT scl.fk_stock_column_slot,
                    COUNT(p.id) AS cnt
                FROM public.paloxes p
                    JOIN public.stock_column_slot_levels scl ON scl.id = p.fk_stock_column_slot_level
                WHERE scl.fk_stock_column_slot = ANY(v_affected_slot_ids)
                GROUP BY 1
            ) AS p_counts ON p_counts.fk_stock_column_slot = scs_base.id
        WHERE scs_base.id = ANY(v_affected_slot_ids)
    ) AS sub
WHERE scs.id = sub.fk_stock_column_slot
    AND scs.current_taken_levels IS DISTINCT
FROM sub.cnt;

END;

$BODY$;

ALTER FUNCTION public.do_update_taken_levels_fnc(bigint []) OWNER TO postgres;

REVOKE EXECUTE ON FUNCTION public.do_update_taken_levels_fnc(bigint [])
FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.do_update_taken_levels_fnc(bigint [])
FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.do_update_taken_levels_fnc(bigint [])
FROM anon;

GRANT EXECUTE ON FUNCTION public.do_update_taken_levels_fnc(bigint []) TO postgres;

GRANT EXECUTE ON FUNCTION public.do_update_taken_levels_fnc(bigint []) TO service_role;

CREATE OR REPLACE FUNCTION public.update_stored_at_taken_levels_after_palox_delete_trg_fnc() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '' AS $$
DECLARE v_level_ids BIGINT [];

BEGIN
SELECT array_agg(fk_stock_column_slot_level) INTO v_level_ids
FROM old_paloxes
WHERE fk_stock_column_slot_level IS NOT NULL;

IF v_level_ids IS NOT NULL THEN PERFORM public.do_update_taken_levels_fnc(v_level_ids);

END IF;

RETURN NULL;

END;

$$;

ALTER FUNCTION public.update_stored_at_taken_levels_after_palox_delete_trg_fnc() OWNER TO postgres;

REVOKE EXECUTE ON FUNCTION public.update_stored_at_taken_levels_after_palox_delete_trg_fnc()
FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.update_stored_at_taken_levels_after_palox_delete_trg_fnc()
FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.update_stored_at_taken_levels_after_palox_delete_trg_fnc()
FROM anon;

GRANT EXECUTE ON FUNCTION public.update_stored_at_taken_levels_after_palox_delete_trg_fnc() TO postgres;

GRANT EXECUTE ON FUNCTION public.update_stored_at_taken_levels_after_palox_delete_trg_fnc() TO service_role;

CREATE OR REPLACE FUNCTION public.update_stored_at_taken_levels_after_palox_insert_trg_fnc() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '' AS $$
DECLARE v_level_ids BIGINT [];

BEGIN
SELECT array_agg(fk_stock_column_slot_level) INTO v_level_ids
FROM new_paloxes
WHERE fk_stock_column_slot_level IS NOT NULL;

IF v_level_ids IS NOT NULL THEN PERFORM public.do_update_taken_levels_fnc(v_level_ids);

END IF;

RETURN NULL;

END;

$$;

ALTER FUNCTION public.update_stored_at_taken_levels_after_palox_insert_trg_fnc() OWNER TO postgres;

REVOKE EXECUTE ON FUNCTION public.update_stored_at_taken_levels_after_palox_insert_trg_fnc()
FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.update_stored_at_taken_levels_after_palox_insert_trg_fnc()
FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.update_stored_at_taken_levels_after_palox_insert_trg_fnc()
FROM anon;

GRANT EXECUTE ON FUNCTION public.update_stored_at_taken_levels_after_palox_insert_trg_fnc() TO postgres;

GRANT EXECUTE ON FUNCTION public.update_stored_at_taken_levels_after_palox_insert_trg_fnc() TO service_role;