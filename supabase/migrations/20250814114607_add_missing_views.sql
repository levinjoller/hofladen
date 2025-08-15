DROP VIEW IF EXISTS public.stocks_view;

DROP VIEW IF EXISTS public.products_view;

DROP VIEW IF EXISTS public.suppliers_persons_view;

DROP VIEW IF EXISTS public.customers_persons_view;

DROP VIEW IF EXISTS public.paloxes_palox_types_view;

CREATE OR REPLACE VIEW public.paloxes_full_display_name_view WITH (security_invoker = TRUE) AS
SELECT p.id,
    (pt.label_prefix || '-'::text) || lpad(p.number_per_type::text, 3, '0'::text) AS display_name
FROM public.paloxes p
    JOIN public.palox_types pt ON p.fk_palox_type = pt.id
WHERE p.fk_stock_column_slot_level IS NULL;