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
        ORDER BY scsl.level DESC
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