CREATE UNIQUE INDEX IF NOT EXISTS unique_palox_number_per_type ON public.paloxes (number_per_type, fk_palox_type);

DROP FUNCTION IF EXISTS "public"."assign_palox_to_next_free_level_in_slot_fnc"(bigint, bigint, bigint, bigint, bigint);

CREATE OR REPLACE FUNCTION "public"."assign_palox_to_next_free_level_in_slot_fnc"(
        "p_palox_type_id" bigint,
        "p_palox_number" bigint,
        "p_stock_column_slot_id" bigint,
        "p_product_id" bigint,
        "p_supplier_id" bigint,
        "p_customer_id" bigint DEFAULT NULL::bigint
    ) RETURNS "void" LANGUAGE "plpgsql" SECURITY DEFINER
SET "search_path" TO '' AS $$
DECLARE v_next_free_slot_level_id BIGINT;

v_palox_id BIGINT;

v_current_slot_level_id BIGINT;

BEGIN PERFORM 1
FROM public.palox_types
WHERE id = p_palox_type_id
LIMIT 1;

IF NOT FOUND THEN RAISE EXCEPTION 'palox_type with ID % does not exist.',
p_palox_type_id USING ERRCODE = 'YY001',
HINT = 'please check the ID.';

END IF;

PERFORM 1
FROM public.products
WHERE id = p_product_id
LIMIT 1;

IF NOT FOUND THEN RAISE EXCEPTION 'product with ID % does not exist.',
p_product_id USING ERRCODE = 'YY002',
HINT = 'please check the ID.';

END IF;

PERFORM 1
FROM public.suppliers
WHERE id = p_supplier_id
LIMIT 1;

IF NOT FOUND THEN RAISE EXCEPTION 'supplier with ID % does not exist.',
p_supplier_id USING ERRCODE = 'YY003',
HINT = 'please check the ID.';

END IF;

IF p_customer_id IS NOT NULL THEN PERFORM 1
FROM public.customers
WHERE id = p_customer_id
LIMIT 1;

IF NOT FOUND THEN RAISE EXCEPTION 'customer with ID % does not exist.',
p_customer_id USING ERRCODE = 'YY004',
HINT = 'please check the ID.';

END IF;

END IF;

SELECT id INTO v_palox_id
FROM public.paloxes
WHERE number_per_type = p_palox_number
    AND fk_palox_type = p_palox_type_id FOR
UPDATE;

IF v_palox_id IS NULL THEN
INSERT INTO public.paloxes (
        number_per_type,
        fk_palox_type,
        fk_supplier,
        fk_product,
        fk_customer
    )
VALUES (
        p_palox_number,
        p_palox_type_id,
        p_supplier_id,
        p_product_id,
        p_customer_id
    )
RETURNING id INTO v_palox_id;

RAISE NOTICE 'new palox with number % und ID % created.',
p_palox_number,
v_palox_id;

END IF;

SELECT fk_stock_column_slot_level INTO v_current_slot_level_id
FROM public.paloxes
WHERE id = v_palox_id;

IF v_current_slot_level_id IS NOT NULL THEN RAISE EXCEPTION 'palox with ID % is already stocked at slot level ID %.',
v_palox_id,
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
v_palox_id USING ERRCODE = 'YY006',
HINT = 'please remove some paloxes from the stock or add more slot levels.';

END IF;

UPDATE public.paloxes
SET fk_stock_column_slot_level = v_next_free_slot_level_id,
    fk_product = p_product_id,
    fk_customer = p_customer_id,
    fk_supplier = p_supplier_id
WHERE id = v_palox_id;

END;

$$;

ALTER FUNCTION "public"."assign_palox_to_next_free_level_in_slot_fnc"(
    "p_palox_type_id" bigint,
    "p_palox_number" bigint,
    "p_stock_column_slot_id" bigint,
    "p_product_id" bigint,
    "p_supplier_id" bigint,
    "p_customer_id" bigint
) OWNER TO "postgres";

ALTER TABLE public.paloxes
ADD CONSTRAINT paloxes_number_per_type_range_chk CHECK (
        number_per_type >= 1
        AND number_per_type <= 9999
    );