CREATE OR REPLACE VIEW "public"."products_view" AS
SELECT id,
    display_name
FROM "public"."products";

REVOKE
SELECT ON public.products_view
FROM public;

ALTER TABLE public.paloxes DROP COLUMN updated_at;

ALTER TABLE public.paloxes
ADD COLUMN stored_at timestamptz;

UPDATE public.paloxes
SET stored_at = NOW()
WHERE stored_at IS NULL
    AND fk_stock_column_slot_level IS NOT NULL;

CREATE OR REPLACE VIEW public.paloxes_in_stock_view AS
SELECT p.id,
    p.stored_at,
    pt.label_prefix || '-' || LPAD(p.number_per_type::text, 3, '0') AS palox_display_name,
    per_c.display_name AS customer_person_display_name,
    prod.display_name AS product_display_name,
    per_s.display_name AS supplier_person_display_name,
    CONCAT_WS(
        '.',
        s.stock::text,
        sc.display_name,
        scs.slot::text,
        scl.level::text
    ) AS stock_location_display_name
FROM public.paloxes p
    LEFT JOIN public.customers c ON p.fk_customer = c.id
    LEFT JOIN public.persons per_c ON c.fk_person = per_c.id
    JOIN public.products prod ON p.fk_product = prod.id
    JOIN public.suppliers sup ON p.fk_supplier = sup.id
    JOIN public.persons per_s ON sup.fk_person = per_s.id
    JOIN public.stock_column_slot_levels scl ON p.fk_stock_column_slot_level = scl.id
    JOIN public.stock_column_slots scs ON scl.fk_stock_column_slot = scs.id
    JOIN public.stock_columns sc ON scs.fk_stock_column = sc.id
    JOIN public.stocks s ON sc.fk_stock = s.id
    JOIN public.palox_types pt ON p.fk_palox_type = pt.id
WHERE p.fk_stock_column_slot_level IS NOT NULL;

REVOKE
SELECT ON public.paloxes_in_stock_view
FROM public;