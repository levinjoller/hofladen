DROP VIEW IF EXISTS public.paloxes_palox_types_view;

CREATE OR REPLACE VIEW public.paloxes_palox_types_view AS
SELECT p.id,
  p.number_per_type,
  pt.label_prefix AS palox_types_label_prefix
FROM public.paloxes p
  JOIN public.palox_types pt ON p.fk_palox_type = pt.id
WHERE p.fk_stock_column_slot_level IS NULL;

CREATE OR REPLACE FUNCTION public.assign_palox_to_next_free_level_in_slot_fnc(
    p_palox_id BIGINT,
    p_stock_column_slot_id BIGINT,
    p_product_id BIGINT,
    p_supplier_id BIGINT,
    p_customer_id BIGINT DEFAULT NULL
  ) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
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

IF NOT v_palox_exists THEN RAISE EXCEPTION 'Die Paloxe mit ID % existiert nicht.',
p_palox_id;

END IF;

SELECT EXISTS (
    SELECT 1
    FROM public.products
    WHERE id = p_product_id
  ) INTO v_product_exists;

IF NOT v_product_exists THEN RAISE EXCEPTION 'Produkt mit ID % existiert nicht.',
p_product_id;

END IF;

SELECT EXISTS (
    SELECT 1
    FROM public.suppliers
    WHERE id = p_supplier_id
  ) INTO v_supplier_exists;

IF NOT v_supplier_exists THEN RAISE EXCEPTION 'Lieferant mit ID % existiert nicht.',
p_supplier_id;

END IF;

IF p_customer_id IS NOT NULL THEN
SELECT EXISTS (
    SELECT 1
    FROM public.customers
    WHERE id = p_customer_id
  ) INTO v_customer_exists;

IF NOT v_customer_exists THEN RAISE EXCEPTION 'Kunde mit ID % existiert nicht.',
p_customer_id;

END IF;

END IF;

SELECT fk_stock_column_slot_level INTO v_current_slot_level_id
FROM public.paloxes
WHERE id = p_palox_id;

IF v_current_slot_level_id IS NOT NULL THEN RAISE EXCEPTION 'Paloxe mit ID % ist bereits eingelagert (Slot-Level %).',
p_palox_id,
v_current_slot_level_id;

END IF;

SELECT scsl.id INTO v_next_free_slot_level_id
FROM public.stock_column_slot_levels scsl
WHERE scsl.fk_stock_column_slot = p_stock_column_slot_id
  AND scsl.is_taken = FALSE
ORDER BY scsl.level ASC
LIMIT 1 FOR
UPDATE;

IF v_next_free_slot_level_id IS NULL THEN RAISE EXCEPTION 'Keine freien Slot-Level in stock_column_slot % gefunden, um Paloxe % zuzuweisen.',
p_stock_column_slot_id,
p_palox_id;

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
  ) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
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

IF v_slot_id IS NULL THEN RAISE EXCEPTION 'Slot-Level mit ID % existiert nicht.',
p_slot_level_id;

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

$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_taken_level_flags_counts_delegate_fnc_trg ON public.paloxes;

CREATE TRIGGER update_taken_level_flags_counts_delegate_fnc_trg BEFORE
INSERT
  OR
UPDATE
  OR DELETE ON public.paloxes FOR EACH ROW EXECUTE FUNCTION public.update_taken_level_flags_counts_delegate_fnc();

GRANT EXECUTE ON FUNCTION public.assign_palox_to_next_free_level_in_slot_fnc(BIGINT, BIGINT, BIGINT, BIGINT, BIGINT) TO authenticated;

GRANT EXECUTE ON FUNCTION public.update_taken_level_flags_counts_delegate_fnc() TO authenticated;