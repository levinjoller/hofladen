DROP VIEW IF EXISTS public.paloxes_name_by_slot_view;

CREATE OR REPLACE VIEW public.paloxes_name_by_slot_view WITH (security_invoker = TRUE) AS
SELECT scs.id AS slot_id,
    CONCAT(sc.display_name, '.', scs.slot) AS slot_display_name,
    sc.column,
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
    sc.column,
    scs.max_level
ORDER BY sc.display_name ASC,
    scs.slot ASC;

GRANT SELECT ON public.paloxes_name_by_slot_view TO authenticated;

GRANT SELECT ON public.paloxes_name_by_slot_view TO service_role;