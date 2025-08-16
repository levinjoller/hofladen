DROP VIEW IF EXISTS public.stock_column_slots_columns_view;

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
            scs.max_level - scs.current_taken_levels
        )
        ORDER BY scs.slot ASC
    ) AS slots
FROM public.stock_columns sc
    JOIN public.stock_column_slots scs ON sc.id = scs.fk_stock_column
GROUP BY sc.id,
    sc.column,
    sc.fk_stock;