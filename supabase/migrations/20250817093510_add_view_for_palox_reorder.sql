DROP VIEW IF EXISTS public.paloxes_name_by_slot_view;

CREATE OR REPLACE VIEW public.paloxes_name_by_slot_view WITH (security_invoker = TRUE) AS
SELECT scsl.fk_stock_column_slot AS slot_id,
    CONCAT(sc.display_name, '.', scs.slot) AS slot_display_name,
    scs.slot,
    scs.max_level,
    json_agg(
        json_build_object(
            'level',
            scsl.level,
            'palox_id',
            p.id,
            'display_name',
            (pt.label_prefix || '-'::text) || lpad(p.number_per_type::text, 3, '0'::text)
        )
        ORDER BY scsl.level ASC
    ) AS levels
FROM paloxes p
    JOIN palox_types pt ON p.fk_palox_type = pt.id
    JOIN stock_column_slot_levels scsl ON p.fk_stock_column_slot_level = scsl.id
    JOIN stock_column_slots scs ON scsl.fk_stock_column_slot = scs.id
    JOIN stock_columns sc ON scs.fk_stock_column = sc.id
WHERE p.fk_stock_column_slot_level IS NOT NULL
GROUP BY scsl.fk_stock_column_slot,
    sc.display_name,
    scs.slot,
    scs.max_level;

DROP VIEW IF EXISTS public.stock_column_slots_by_column_view;

CREATE OR REPLACE VIEW public.stock_column_slots_by_column_view WITH (security_invoker = TRUE) AS
SELECT sc.id AS stock_column_id,
    sc.column AS column_number,
    sc.fk_stock,
    jsonb_agg(
        jsonb_build_object(
            'slot_id',
            scs.id,
            'display_name',
            CONCAT(sc.display_name, '.', scs.slot),
            'is_full',
            scs.current_taken_levels >= scs.max_level,
            'free_levels',
            scs.max_level - scs.current_taken_levels,
            'current_taken_levels',
            scs.current_taken_levels
        )
        ORDER BY scs.slot ASC
    ) AS slots
FROM public.stock_columns sc
    JOIN public.stock_column_slots scs ON sc.id = scs.fk_stock_column
GROUP BY sc.id,
    sc.column,
    sc.fk_stock;