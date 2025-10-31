DROP FUNCTION IF EXISTS public.do_update_taken_levels_fnc(BIGINT []);

CREATE OR REPLACE FUNCTION public.do_update_taken_levels_fnc(p_affected_level_ids BIGINT []) RETURNS void LANGUAGE plpgsql AS $$ BEGIN -------------------------------------------------------------------------
    WITH affected_levels AS (
        SELECT DISTINCT s.level_id
        FROM UNNEST(p_affected_level_ids) AS s(level_id)
        WHERE s.level_id IS NOT NULL
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