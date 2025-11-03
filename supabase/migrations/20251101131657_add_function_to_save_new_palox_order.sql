CREATE TYPE slot_palox_order_data AS (
    slot_id integer,
    ordered_palox_ids integer []
);

DROP FUNCTION IF EXISTS public.update_palox_order_batch_fnc(public.slot_palox_order_data []);

CREATE OR REPLACE FUNCTION public.update_palox_order_batch_fnc(
        p_slot_orders public.slot_palox_order_data []
    ) RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '' AS $function$
DECLARE l_slot_order public.slot_palox_order_data;

l_slot_id integer;

l_palox_count integer;

l_max_level integer;

l_all_target_palox_ids integer [];

l_existing_palox_ids integer [];

BEGIN IF p_slot_orders IS NULL
OR array_length(p_slot_orders, 1) IS NULL THEN RETURN;

END IF;

l_all_target_palox_ids := ARRAY(
    SELECT palox_id
    FROM UNNEST(p_slot_orders) AS x(slot_id, ordered_palox_ids),
        UNNEST(x.ordered_palox_ids) AS palox_id
);

SELECT COALESCE(ARRAY_AGG(p.id), ARRAY []::integer []) INTO l_existing_palox_ids
FROM public.paloxes p
    JOIN public.stock_column_slot_levels scl ON p.fk_stock_column_slot_level = scl.id
WHERE scl.fk_stock_column_slot IN (
        SELECT slot_id
        FROM UNNEST(p_slot_orders)
    );

IF array_length(
    ARRAY(
        SELECT UNNEST(l_all_target_palox_ids)
        EXCEPT
        SELECT UNNEST(l_existing_palox_ids)
    ),
    1
) > 0 THEN RAISE EXCEPTION 'at least one palox was not originally placed in one of the provided slots.' USING ERRCODE = 'YY008',
HINT = 'please check that fk_stock_column_slot_level from all provided paloxes matches one of the slots.';

END IF;

UPDATE public.paloxes
SET fk_stock_column_slot_level = NULL
WHERE fk_stock_column_slot_level IN (
        SELECT id
        FROM public.stock_column_slot_levels
        WHERE fk_stock_column_slot IN (
                SELECT slot_id
                FROM UNNEST(p_slot_orders)
            )
    );

FOREACH l_slot_order IN ARRAY p_slot_orders LOOP l_slot_id := l_slot_order.slot_id;

l_palox_count := array_length(l_slot_order.ordered_palox_ids, 1);

IF l_palox_count IS NULL
OR l_palox_count = 0 THEN CONTINUE;

END IF;

SELECT max_level INTO l_max_level
FROM public.stock_column_slots
WHERE id = l_slot_id;

IF l_max_level IS NULL THEN RAISE EXCEPTION 'max_level for slot with ID % is empty or slot does not exist.',
l_slot_id USING ERRCODE = 'YY009',
HINT = 'please check that the max_level is set and slot exists.';

END IF;

IF l_palox_count > l_max_level THEN RAISE EXCEPTION 'slot with ID % oversteps max_level (% > %).',
l_slot_id,
l_palox_count,
l_max_level USING ERRCODE = 'YY010',
HINT = 'please reduce the amount of paloxes for the slot.';

END IF;

WITH ordered_levels AS (
    SELECT scl.id AS level_id,
        i.idx
    FROM public.stock_column_slot_levels scl
        JOIN generate_subscripts(l_slot_order.ordered_palox_ids, 1) AS i(idx) ON scl.level = i.idx
    WHERE scl.fk_stock_column_slot = l_slot_id
)
UPDATE public.paloxes p
SET fk_stock_column_slot_level = ol.level_id
FROM ordered_levels ol
WHERE p.id = l_slot_order.ordered_palox_ids [ol.idx];

END LOOP;

END;

$function$;

GRANT EXECUTE ON FUNCTION public.update_palox_order_batch_fnc(public.slot_palox_order_data []) TO authenticated;

ALTER FUNCTION public.update_palox_order_batch_fnc(public.slot_palox_order_data []) OWNER TO postgres;

CREATE OR REPLACE FUNCTION public.do_update_taken_levels_fnc(p_affected_level_ids BIGINT []) RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '' AS $$ BEGIN WITH affected_levels AS (
        SELECT DISTINCT level_id
        FROM unnest(p_affected_level_ids) AS level_id
        WHERE level_id IS NOT NULL
    ),
    calculated_status AS (
        SELECT al.level_id AS id,
            EXISTS (
                SELECT 1
                FROM public.paloxes p
                WHERE p.fk_stock_column_slot_level = al.level_id
            ) AS new_is_taken_status
        FROM affected_levels al
    )
UPDATE public.stock_column_slot_levels AS l
SET is_taken = cs.new_is_taken_status
FROM calculated_status cs
WHERE l.id = cs.id
    AND l.is_taken IS DISTINCT
FROM cs.new_is_taken_status;

WITH affected_slots AS (
    SELECT DISTINCT fk_stock_column_slot AS slot_id
    FROM public.stock_column_slot_levels
    WHERE id = ANY(p_affected_level_ids)
),
calculated_counts AS (
    SELECT ast.slot_id AS fk_stock_column_slot,
        COUNT(sl.id) FILTER (
            WHERE sl.is_taken
        ) AS cnt
    FROM affected_slots ast
        LEFT JOIN public.stock_column_slot_levels sl ON sl.fk_stock_column_slot = ast.slot_id
    GROUP BY ast.slot_id
)
UPDATE public.stock_column_slots AS scs
SET current_taken_levels = COALESCE(cc.cnt, 0)
FROM calculated_counts cc
WHERE scs.id = cc.fk_stock_column_slot
    AND scs.current_taken_levels IS DISTINCT
FROM COALESCE(cc.cnt, 0);

END;

$$;

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

CREATE OR REPLACE FUNCTION public.update_stored_at_taken_levels_after_palox_update_trg_fnc() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '' AS $$
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

$$;

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

DROP TRIGGER IF EXISTS update_stored_at_taken_levels_after_palox_insert_trg ON public.paloxes;

CREATE TRIGGER update_stored_at_taken_levels_after_palox_insert_trg
AFTER
INSERT ON public.paloxes REFERENCING NEW TABLE AS new_paloxes FOR EACH STATEMENT EXECUTE FUNCTION public.update_stored_at_taken_levels_after_palox_insert_trg_fnc();

DROP TRIGGER IF EXISTS update_stored_at_taken_levels_after_palox_update_trg ON public.paloxes;

CREATE TRIGGER update_stored_at_taken_levels_after_palox_update_trg
AFTER
UPDATE ON public.paloxes REFERENCING NEW TABLE AS new_paloxes OLD TABLE AS old_paloxes FOR EACH STATEMENT EXECUTE FUNCTION public.update_stored_at_taken_levels_after_palox_update_trg_fnc();

DROP TRIGGER IF EXISTS update_stored_at_taken_levels_after_palox_delete_trg ON public.paloxes;

CREATE TRIGGER update_stored_at_taken_levels_after_palox_delete_trg
AFTER DELETE ON public.paloxes REFERENCING OLD TABLE AS old_paloxes FOR EACH STATEMENT EXECUTE FUNCTION public.update_stored_at_taken_levels_after_palox_delete_trg_fnc();

CREATE OR REPLACE VIEW public.paloxes_name_by_slot_view WITH (security_invoker = TRUE) AS
SELECT scs.id AS slot_id,
    CONCAT(sc.display_name, '.', scs.slot) AS slot_display_name,
    scs.slot,
    scs.max_level,
    COALESCE(
        json_agg(
            json_build_object(
                'level',
                scsl.level,
                'palox_id',
                p.id,
                'display_name',
                (
                    pt.label_prefix || '-' || lpad(p.number_per_type::text, 3, '0')
                )
            )
            ORDER BY scsl.level ASC
        ) FILTER (
            WHERE p.id IS NOT NULL
        ),
        '[]'::json
    ) AS levels
FROM stock_column_slots scs
    JOIN stock_columns sc ON scs.fk_stock_column = sc.id
    LEFT JOIN stock_column_slot_levels scsl ON scsl.fk_stock_column_slot = scs.id
    LEFT JOIN paloxes p ON p.fk_stock_column_slot_level = scsl.id
    LEFT JOIN palox_types pt ON p.fk_palox_type = pt.id
GROUP BY scs.id,
    sc.display_name,
    scs.slot,
    scs.max_level
ORDER BY sc.display_name ASC,
    scs.slot ASC;