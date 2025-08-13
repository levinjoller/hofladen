ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny read access for anon" ON public.customers AS PERMISSIVE FOR
SELECT TO anon USING (false);

CREATE POLICY "Allow read access for authenticated users" ON public.customers AS PERMISSIVE FOR
SELECT TO authenticated USING (TRUE);

ALTER TABLE public.palox_histories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny read access for anon" ON public.palox_histories AS PERMISSIVE FOR
SELECT TO anon USING (false);

CREATE POLICY "Allow read access for authenticated users" ON public.palox_histories AS PERMISSIVE FOR
SELECT TO authenticated USING (TRUE);

ALTER TABLE public.palox_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny read access for anon" ON public.palox_types AS PERMISSIVE FOR
SELECT TO anon USING (false);

CREATE POLICY "Allow read access for authenticated users" ON public.palox_types AS PERMISSIVE FOR
SELECT TO authenticated USING (TRUE);

ALTER TABLE public.paloxes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny read access for anon" ON public.paloxes AS PERMISSIVE FOR
SELECT TO anon USING (false);

CREATE POLICY "Allow read access for authenticated users" ON public.paloxes AS PERMISSIVE FOR
SELECT TO authenticated USING (TRUE);

ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny read access for anon" ON public.persons AS PERMISSIVE FOR
SELECT TO anon USING (false);

CREATE POLICY "Allow read access for authenticated users" ON public.persons AS PERMISSIVE FOR
SELECT TO authenticated USING (TRUE);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny read access for anon" ON public.products AS PERMISSIVE FOR
SELECT TO anon USING (false);

CREATE POLICY "Allow read access for authenticated users" ON public.products AS PERMISSIVE FOR
SELECT TO authenticated USING (TRUE);

ALTER TABLE public.stock_column_slot_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny read access for anon" ON public.stock_column_slot_levels AS PERMISSIVE FOR
SELECT TO anon USING (false);

CREATE POLICY "Allow read access for authenticated users" ON public.stock_column_slot_levels AS PERMISSIVE FOR
SELECT TO authenticated USING (TRUE);

ALTER TABLE public.stock_column_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny read access for anon" ON public.stock_column_slots AS PERMISSIVE FOR
SELECT TO anon USING (false);

CREATE POLICY "Allow read access for authenticated users" ON public.stock_column_slots AS PERMISSIVE FOR
SELECT TO authenticated USING (TRUE);

ALTER TABLE public.stock_columns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny read access for anon" ON public.stock_columns AS PERMISSIVE FOR
SELECT TO anon USING (false);

CREATE POLICY "Allow read access for authenticated users" ON public.stock_columns AS PERMISSIVE FOR
SELECT TO authenticated USING (TRUE);

ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny read access for anon" ON public.stocks AS PERMISSIVE FOR
SELECT TO anon USING (false);

CREATE POLICY "Allow read access for authenticated users" ON public.stocks AS PERMISSIVE FOR
SELECT TO authenticated USING (TRUE);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny read access for anon" ON public.suppliers AS PERMISSIVE FOR
SELECT TO anon USING (false);

CREATE POLICY "Allow read access for authenticated users" ON public.suppliers AS PERMISSIVE FOR
SELECT TO authenticated USING (TRUE);

---
DROP VIEW IF EXISTS public.customers_persons_view;

CREATE VIEW public.customers_persons_view WITH (security_invoker = TRUE) AS
SELECT c.id,
    p.display_name AS person_display_name
FROM customers c
    JOIN persons p ON c.fk_person = p.id;

---
DROP VIEW IF EXISTS public.paloxes_in_stock_view;

CREATE VIEW public.paloxes_in_stock_view WITH (security_invoker = TRUE) AS
SELECT p.id,
    p.stored_at,
    (pt.label_prefix || '-'::text) || lpad(p.number_per_type::text, 3, '0'::text) AS palox_display_name,
    per_c.display_name AS customer_person_display_name,
    prod.display_name AS product_display_name,
    per_s.display_name AS supplier_person_display_name,
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
    JOIN suppliers sup ON p.fk_supplier = sup.id
    JOIN persons per_s ON sup.fk_person = per_s.id
    JOIN stock_column_slot_levels scl ON p.fk_stock_column_slot_level = scl.id
    JOIN stock_column_slots scs ON scl.fk_stock_column_slot = scs.id
    JOIN stock_columns sc ON scs.fk_stock_column = sc.id
    JOIN stocks s ON sc.fk_stock = s.id
    JOIN palox_types pt ON p.fk_palox_type = pt.id
WHERE p.fk_stock_column_slot_level IS NOT NULL;

DROP VIEW IF EXISTS public.paloxes_palox_types_view;

CREATE VIEW public.paloxes_palox_types_view WITH (security_invoker = TRUE) AS
SELECT p.id,
    p.number_per_type,
    pt.label_prefix AS palox_types_label_prefix
FROM paloxes p
    JOIN palox_types pt ON p.fk_palox_type = pt.id
WHERE p.fk_stock_column_slot_level IS NULL;

DROP VIEW IF EXISTS public.products_view;

CREATE VIEW public.products_view WITH (security_invoker = TRUE) AS
SELECT id,
    display_name
FROM products;

DROP VIEW IF EXISTS public.stock_column_slots_columns_view;

CREATE VIEW public.stock_column_slots_columns_view WITH (security_invoker = TRUE) AS
SELECT sc.id AS stock_column_id,
    sc.fk_stock,
    sc."column" AS stock_column_number,
    sc.display_name AS stock_column_display_name,
    scs.id AS stock_column_slot_id,
    scs.slot AS stock_slot_number,
    scs.current_taken_levels >= scs.max_level AS is_full,
    scs.max_level - scs.current_taken_levels AS free_levels
FROM stock_columns sc
    JOIN stock_column_slots scs ON sc.id = scs.fk_stock_column;

DROP VIEW IF EXISTS public.stocks_view;

CREATE VIEW public.stocks_view WITH (security_invoker = TRUE) AS
SELECT id,
    stock
FROM stocks;

DROP VIEW IF EXISTS public.suppliers_persons_view;

CREATE VIEW public.suppliers_persons_view WITH (security_invoker = TRUE) AS
SELECT s.id,
    p.display_name AS person_display_name
FROM suppliers s
    JOIN persons p ON s.fk_person = p.id;

CREATE OR REPLACE FUNCTION public.assign_palox_to_next_free_level_in_slot_fnc(
        p_palox_id BIGINT,
        p_stock_column_slot_id BIGINT,
        p_product_id BIGINT,
        p_supplier_id BIGINT,
        p_customer_id BIGINT DEFAULT NULL
    ) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '' AS $$
DECLARE v_next_free_slot_level_id BIGINT;

v_palox_exists BOOLEAN;

v_product_exists BOOLEAN;

v_supplier_exists BOOLEAN;

v_customer_exists BOOLEAN;

v_current_slot_level_id BIGINT;

BEGIN
SELECT EXISTS (
        SELECT 1
        FROM public.paloxes
        WHERE id = p_palox_id
    ) INTO v_palox_exists;

IF NOT v_palox_exists THEN RAISE EXCEPTION 'paloxe with ID % does not exist.',
p_palox_id USING ERRCODE = 'YY001',
HINT = 'please check the ID.';

END IF;

SELECT EXISTS (
        SELECT 1
        FROM public.products
        WHERE id = p_product_id
    ) INTO v_product_exists;

IF NOT v_product_exists THEN RAISE EXCEPTION 'product with ID % does not exist.',
p_product_id USING ERRCODE = 'YY002',
HINT = 'please check the ID.';

END IF;

SELECT EXISTS (
        SELECT 1
        FROM public.suppliers
        WHERE id = p_supplier_id
    ) INTO v_supplier_exists;

IF NOT v_supplier_exists THEN RAISE EXCEPTION 'supplier with ID % does not exist.',
p_supplier_id USING ERRCODE = 'YY003',
HINT = 'please check the ID.';

END IF;

IF p_customer_id IS NOT NULL THEN
SELECT EXISTS (
        SELECT 1
        FROM public.customers
        WHERE id = p_customer_id
    ) INTO v_customer_exists;

IF NOT v_customer_exists THEN RAISE EXCEPTION 'customer with ID % does not exist.',
p_customer_id USING ERRCODE = 'YY004',
HINT = 'please check the ID.';

END IF;

END IF;

SELECT fk_stock_column_slot_level INTO v_current_slot_level_id
FROM public.paloxes
WHERE id = p_palox_id;

IF v_current_slot_level_id IS NOT NULL THEN RAISE EXCEPTION 'palox with ID % is already stocked at slot level ID %.',
p_palox_id,
v_current_slot_level_id USING ERRCODE = 'YY005',
HINT = 'please remove the palox from the stock first.';

END IF;

SELECT scsl.id INTO v_next_free_slot_level_id
FROM public.stock_column_slot_levels scsl
WHERE scsl.fk_stock_column_slot = p_stock_column_slot_id
    AND scsl.is_taken = FALSE
ORDER BY scsl.level ASC
LIMIT 1 FOR
UPDATE;

IF v_next_free_slot_level_id IS NULL THEN RAISE EXCEPTION 'no available slot_level in slot_column_slot ID % found to stock palox ID %.',
p_stock_column_slot_id,
p_palox_id USING ERRCODE = 'YY006',
HINT = 'please remove some paloxes from the stock or add more slot levels.';

END IF;

UPDATE public.paloxes
SET fk_stock_column_slot_level = v_next_free_slot_level_id,
    fk_product = p_product_id,
    fk_customer = p_customer_id,
    fk_supplier = p_supplier_id
WHERE id = p_palox_id;

END;

$$;

CREATE OR REPLACE FUNCTION public.update_taken_level_flags_counts_fnc(
        p_slot_level_id BIGINT,
        p_is_taken BOOLEAN
    ) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '' AS $$
DECLARE v_slot_id BIGINT;

v_increment INT := CASE
    WHEN p_is_taken THEN 1
    ELSE -1
END;

BEGIN
UPDATE public.stock_column_slot_levels
SET is_taken = p_is_taken
WHERE id = p_slot_level_id
RETURNING fk_stock_column_slot INTO v_slot_id;

IF v_slot_id IS NULL THEN RAISE EXCEPTION 'slot_level ID % not found.',
p_slot_level_id USING ERRCODE = 'YY007',
HINT = 'please check the ID.';

END IF;

UPDATE public.stock_column_slots
SET current_taken_levels = current_taken_levels + v_increment
WHERE id = v_slot_id;

END;

$$;

CREATE OR REPLACE FUNCTION public.update_taken_level_flags_counts_delegate_fnc() RETURNS TRIGGER AS $$ BEGIN IF OLD.fk_stock_column_slot_level IS NOT NULL
    AND (
        NEW.fk_stock_column_slot_level IS NULL
        OR NEW.fk_stock_column_slot_level IS DISTINCT
        FROM OLD.fk_stock_column_slot_level
    ) THEN PERFORM public.update_taken_level_flags_counts_fnc(OLD.fk_stock_column_slot_level, FALSE);

END IF;

IF NEW.fk_stock_column_slot_level IS NOT NULL
AND (
    OLD.fk_stock_column_slot_level IS NULL
    OR NEW.fk_stock_column_slot_level IS DISTINCT
    FROM OLD.fk_stock_column_slot_level
) THEN PERFORM public.update_taken_level_flags_counts_fnc(NEW.fk_stock_column_slot_level, TRUE);

IF OLD.fk_stock_column_slot_level IS NULL THEN NEW.stored_at := NOW();

END IF;

END IF;

IF TG_OP = 'DELETE' THEN RETURN OLD;

ELSE RETURN NEW;

END IF;

END;

$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';