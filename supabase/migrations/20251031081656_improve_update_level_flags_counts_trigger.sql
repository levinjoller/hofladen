DROP TRIGGER IF EXISTS update_taken_level_flags_counts_delegate_fnc_trg ON public.paloxes;

DROP TRIGGER IF EXISTS update_stored_at_taken_levels_after_palox_insert_trg ON public.paloxes;

DROP TRIGGER IF EXISTS update_stored_at_taken_levels_after_palox_update_trg ON public.paloxes;

DROP TRIGGER IF EXISTS update_stored_at_taken_levels_after_palox_delete_trg ON public.paloxes;

DROP FUNCTION IF EXISTS public.do_update_taken_levels_fnc(BIGINT []);

DROP FUNCTION IF EXISTS public.update_taken_level_flags_counts_delegate_fnc();

DROP FUNCTION IF EXISTS public.update_taken_level_flags_counts_fnc(BIGINT, BOOLEAN);

DROP FUNCTION IF EXISTS public.update_stored_at_taken_levels_after_palox_level_change();

DROP FUNCTION IF EXISTS public.update_stored_at_taken_levels_after_palox_insert_trg_fnc();

DROP FUNCTION IF EXISTS public.update_stored_at_taken_levels_after_palox_update_trg_fnc();

DROP FUNCTION IF EXISTS public.update_stored_at_taken_levels_after_palox_delete_trg_fnc();

DROP FUNCTION IF EXISTS public.assign_palox_to_next_free_level_in_slot_fnc(bigint, bigint, bigint, bigint, bigint, bigint);

CREATE OR REPLACE FUNCTION public.do_update_taken_levels_fnc(p_affected_level_ids BIGINT []) RETURNS void AS $$ BEGIN WITH affected_levels AS (
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

UPDATE public.stock_column_slots scs
SET current_taken_levels = sub.cnt
FROM (
        SELECT scsl.fk_stock_column_slot,
            COUNT(scsl.id) AS cnt
        FROM public.stock_column_slot_levels scsl
        WHERE scsl.is_taken = TRUE
            AND scsl.fk_stock_column_slot IN (
                SELECT DISTINCT fk_stock_column_slot
                FROM public.stock_column_slot_levels
                WHERE id = ANY(p_affected_level_ids)
            )
        GROUP BY 1
    ) AS sub
WHERE scs.id = sub.fk_stock_column_slot
    AND scs.current_taken_levels IS DISTINCT
FROM sub.cnt;

END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_stored_at_taken_levels_after_palox_insert_trg_fnc() RETURNS TRIGGER AS $$
DECLARE v_level_ids BIGINT [];

BEGIN
SELECT array_agg(fk_stock_column_slot_level) INTO v_level_ids
FROM new_paloxes
WHERE fk_stock_column_slot_level IS NOT NULL;

IF v_level_ids IS NOT NULL THEN PERFORM public.do_update_taken_levels_fnc(v_level_ids);

END IF;

RETURN NULL;

END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_stored_at_taken_levels_after_palox_update_trg_fnc() RETURNS TRIGGER AS $$
DECLARE v_level_ids BIGINT [];

BEGIN
SELECT array_agg(fk_stock_column_slot_level) INTO v_level_ids
FROM (
        SELECT fk_stock_column_slot_level
        FROM new_paloxes
        UNION
        SELECT fk_stock_column_slot_level
        FROM old_paloxes
    ) AS combined
WHERE fk_stock_column_slot_level IS NOT NULL;

IF v_level_ids IS NOT NULL THEN PERFORM public.do_update_taken_levels_fnc(v_level_ids);

END IF;

RETURN NULL;

END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_stored_at_taken_levels_after_palox_delete_trg_fnc() RETURNS TRIGGER AS $$
DECLARE v_level_ids BIGINT [];

BEGIN
SELECT array_agg(fk_stock_column_slot_level) INTO v_level_ids
FROM old_paloxes
WHERE fk_stock_column_slot_level IS NOT NULL;

IF v_level_ids IS NOT NULL THEN PERFORM public.do_update_taken_levels_fnc(v_level_ids);

END IF;

RETURN NULL;

END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stored_at_taken_levels_after_palox_insert_trg
AFTER
INSERT ON public.paloxes REFERENCING NEW TABLE AS new_paloxes FOR EACH STATEMENT EXECUTE FUNCTION public.update_stored_at_taken_levels_after_palox_insert_trg_fnc();

CREATE TRIGGER update_stored_at_taken_levels_after_palox_update_trg
AFTER
UPDATE ON public.paloxes REFERENCING NEW TABLE AS new_paloxes OLD TABLE AS old_paloxes FOR EACH STATEMENT EXECUTE FUNCTION public.update_stored_at_taken_levels_after_palox_update_trg_fnc();

CREATE TRIGGER update_stored_at_taken_levels_after_palox_delete_trg
AFTER DELETE ON public.paloxes REFERENCING OLD TABLE AS old_paloxes FOR EACH STATEMENT EXECUTE FUNCTION public.update_stored_at_taken_levels_after_palox_delete_trg_fnc();

CREATE OR REPLACE FUNCTION public.assign_palox_to_next_free_level_in_slot_fnc(
        p_palox_type_id bigint,
        p_palox_number bigint,
        p_stock_column_slot_id bigint,
        p_product_id bigint,
        p_supplier_id bigint,
        p_customer_id bigint DEFAULT NULL
    ) RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO '' AS $$
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
INSERT INTO public.paloxes(
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

SELECT id INTO v_next_free_slot_level_id
FROM public.stock_column_slot_levels
WHERE fk_stock_column_slot = p_stock_column_slot_id
    AND is_taken = FALSE
ORDER BY LEVEL ASC
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
    fk_supplier = p_supplier_id,
    stored_at = NOW()
WHERE id = v_palox_id;

END;

$$;

ALTER FUNCTION public.assign_palox_to_next_free_level_in_slot_fnc(bigint, bigint, bigint, bigint, bigint, bigint) OWNER TO postgres;