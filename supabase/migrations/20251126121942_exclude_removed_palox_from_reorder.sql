CREATE OR REPLACE FUNCTION public.remove_palox_and_shift_down(p_palox_id INT) RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '' AS $$
DECLARE v_old_slot_level_id INT;

v_slot_id INT;

v_level_to_remove INT;

v_fk_product INT;

v_fk_customer INT;

v_fk_supplier INT;

v_stored_at TIMESTAMP WITH TIME ZONE;

v_exit_at TIMESTAMP WITH TIME ZONE := NOW();

BEGIN
SELECT p.fk_stock_column_slot_level,
    scl.fk_stock_column_slot,
    scl.level,
    p.fk_product,
    p.fk_customer,
    p.fk_supplier,
    p.stored_at INTO v_old_slot_level_id,
    v_slot_id,
    v_level_to_remove,
    v_fk_product,
    v_fk_customer,
    v_fk_supplier,
    v_stored_at
FROM public.paloxes p
    JOIN public.stock_column_slot_levels scl ON p.fk_stock_column_slot_level = scl.id
WHERE p.id = p_palox_id FOR
UPDATE;

IF v_old_slot_level_id IS NULL THEN RAISE EXCEPTION 'palox with ID % is currently not stored in any slot.',
p_palox_id USING ERRCODE = 'YY014',
HINT = 'please check the ID, or place the palox into any stock first';

END IF;

PERFORM 1
FROM public.paloxes p
    JOIN public.stock_column_slot_levels scl ON p.fk_stock_column_slot_level = scl.id
WHERE scl.fk_stock_column_slot = v_slot_id
    AND scl.level > v_level_to_remove FOR
UPDATE;

INSERT INTO public.palox_histories (
        fk_palox,
        fk_stock_column_slot_level,
        fk_product,
        fk_customer,
        fk_supplier,
        stored_at,
        exit_at,
        created_at
    )
VALUES (
        p_palox_id,
        v_old_slot_level_id,
        v_fk_product,
        v_fk_customer,
        v_fk_supplier,
        v_stored_at,
        v_exit_at,
        v_exit_at
    );

UPDATE public.paloxes
SET fk_stock_column_slot_level = NULL,
    stored_at = NULL
WHERE id = p_palox_id;

WITH PaloxesToShift AS (
    SELECT p.id AS palox_id,
        scl_old.level AS old_level,
        ROW_NUMBER() OVER (
            ORDER BY scl_old.level ASC
        ) AS rn
    FROM public.paloxes p
        JOIN public.stock_column_slot_levels scl_old ON p.fk_stock_column_slot_level = scl_old.id
    WHERE scl_old.fk_stock_column_slot = v_slot_id
        AND scl_old.level > v_level_to_remove
        AND p.id != p_palox_id
),
NewLevels AS (
    SELECT id AS new_level_id,
        LEVEL AS target_level,
        ROW_NUMBER() OVER (
            ORDER BY LEVEL ASC
        ) AS rn
    FROM public.stock_column_slot_levels
    WHERE fk_stock_column_slot = v_slot_id
        AND LEVEL >= v_level_to_remove
        AND LEVEL < v_level_to_remove + (
            SELECT COUNT(*)
            FROM PaloxesToShift
        )
)
UPDATE public.paloxes p
SET fk_stock_column_slot_level = nl.new_level_id
FROM PaloxesToShift pts
    JOIN NewLevels nl ON pts.rn = nl.rn
WHERE p.id = pts.palox_id;

END;

$$;

REVOKE EXECUTE ON FUNCTION public.remove_palox_and_shift_down(integer)
FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.remove_palox_and_shift_down(integer)
FROM anon;

GRANT EXECUTE ON FUNCTION public.remove_palox_and_shift_down(integer) TO authenticated;

GRANT EXECUTE ON FUNCTION public.remove_palox_and_shift_down(integer) TO postgres;

GRANT EXECUTE ON FUNCTION public.remove_palox_and_shift_down(integer) TO service_role;

ALTER TABLE public.paloxes DROP CONSTRAINT paloxes_fk_stock_column_slot_level_key;

ALTER TABLE public.paloxes
ADD CONSTRAINT paloxes_fk_stock_column_slot_level_key UNIQUE (fk_stock_column_slot_level) DEFERRABLE INITIALLY DEFERRED;

CREATE OR REPLACE FUNCTION public.swap_paloxes_between_slots_fnc(p_slot_ids integer []) RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '' AS $$
DECLARE slot_a integer;

slot_b integer;

cnt_a integer;

cnt_b integer;

max_a integer;

max_b integer;

sorted_slots integer [];

target_a_levels bigint [];

target_b_levels bigint [];

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
slot_b USING ERRCODE = 'YY012';

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

IF cnt_a > max_b THEN RAISE EXCEPTION 'slot % (max % level) cannot store % paloxes.',
slot_b,
max_b,
cnt_a USING ERRCODE = 'YY013';

END IF;

IF cnt_b > max_a THEN RAISE EXCEPTION 'slot % (max % level) cannot store % paloxes.',
slot_a,
max_a,
cnt_b USING ERRCODE = 'YY013';

END IF;

SELECT ARRAY_AGG(
        id
        ORDER BY LEVEL
    ) INTO target_b_levels
FROM public.stock_column_slot_levels
WHERE fk_stock_column_slot = slot_b
LIMIT cnt_a;

SELECT ARRAY_AGG(
        id
        ORDER BY LEVEL
    ) INTO target_a_levels
FROM public.stock_column_slot_levels
WHERE fk_stock_column_slot = slot_a
LIMIT cnt_b;

SET CONSTRAINTS public.paloxes_fk_stock_column_slot_level_key DEFERRED;

WITH PaloxesToMove AS (
    SELECT p.id,
        scl.fk_stock_column_slot AS slot_id,
        ROW_NUMBER() OVER (
            PARTITION BY scl.fk_stock_column_slot
            ORDER BY scl.level
        ) AS rn
    FROM public.paloxes p
        JOIN public.stock_column_slot_levels scl ON scl.id = p.fk_stock_column_slot_level
    WHERE scl.fk_stock_column_slot IN (slot_a, slot_b)
)
UPDATE public.paloxes p
SET fk_stock_column_slot_level = CASE
        WHEN ptm.slot_id = slot_a THEN target_b_levels [ptm.rn]
        WHEN ptm.slot_id = slot_b THEN target_a_levels [ptm.rn]
    END
FROM PaloxesToMove ptm
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