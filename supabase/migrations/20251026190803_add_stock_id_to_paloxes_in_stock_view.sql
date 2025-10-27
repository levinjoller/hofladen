DROP VIEW IF EXISTS public.paloxes_in_stock_view;

CREATE VIEW public.paloxes_in_stock_view WITH (security_invoker = TRUE) AS
SELECT p.id,
    p.stored_at,
    (pt.label_prefix || '-'::text) || lpad(p.number_per_type::text, 3, '0'::text) AS palox_display_name,
    per_c.display_name AS customer_person_display_name,
    prod.display_name AS product_display_name,
    prodt.emoji AS product_type_emoji,
    per_s.display_name AS supplier_person_display_name,
    s.id AS stock_id,
    scl.id AS slot_level_id,
    concat_ws(
        '.'::text,
        s.stock::text,
        sc.display_name,
        scs.slot::text,
        scl.level::text
    ) AS stock_location_display_name
FROM paloxes p
    LEFT JOIN customers c ON p.fk_customer = c.id
    LEFT JOIN persons per_c ON c.fk_person = per_c.id
    JOIN products prod ON p.fk_product = prod.id
    JOIN product_types prodt ON prod.fk_product_type = prodt.id
    JOIN suppliers sup ON p.fk_supplier = sup.id
    JOIN persons per_s ON sup.fk_person = per_s.id
    JOIN stock_column_slot_levels scl ON p.fk_stock_column_slot_level = scl.id
    JOIN stock_column_slots scs ON scl.fk_stock_column_slot = scs.id
    JOIN stock_columns sc ON scs.fk_stock_column = sc.id
    JOIN stocks s ON sc.fk_stock = s.id
    JOIN palox_types pt ON p.fk_palox_type = pt.id
WHERE p.fk_stock_column_slot_level IS NOT NULL;

DROP FUNCTION IF EXISTS public.get_taken_level_coordinates_fnc(BigInt);

CREATE OR REPLACE FUNCTION "public"."get_taken_level_coordinates_fnc"(p_stock_id BigInt) RETURNS TABLE (
        slot_level_id BigInt,
        x_column INT,
        y_level INT,
        z_slot INT
    ) LANGUAGE "sql" SECURITY DEFINER
SET "search_path" TO '' AS $$
SELECT scsl.id AS slot_level_id,
    sc.column - 1 AS x_column,
    scsl.level - 1 AS y_level,
    scs.slot - 1 AS z_slot
FROM public.stock_column_slot_levels scsl
    JOIN public.stock_column_slots scs ON scs.id = scsl.fk_stock_column_slot
    JOIN public.stock_columns sc ON sc.id = scs.fk_stock_column
WHERE scsl.is_taken = TRUE
    AND sc.fk_stock = p_stock_id
ORDER BY x_column,
    y_level,
    z_slot;

$$;