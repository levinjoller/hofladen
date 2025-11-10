ALTER TABLE public.palox_histories
ADD COLUMN fk_product INT NOT NULL REFERENCES public.products(id),
    ADD COLUMN fk_customer INT REFERENCES public.customers(id),
    ADD COLUMN fk_supplier INT NOT NULL REFERENCES public.suppliers(id),
    ADD COLUMN stored_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN exit_at TIMESTAMP WITH TIME ZONE;

CREATE OR REPLACE FUNCTION public.remove_palox_and_shift_down(p_palox_id INT) RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '' AS $$
DECLARE v_old_slot_level_id INT;

v_slot_id INT;

v_level_to_remove INT;

v_fk_product INT;

v_fk_customer INT;

v_fk_supplier INT;

v_stored_at TIMESTAMP WITH TIME ZONE;

v_exit_at TIMESTAMP WITH TIME ZONE := NOW();

BEGIN
SELECT p.fk_stock_column_slot_level,
    scl.fk_stock_column_slot,
    scl.level,
    p.fk_product,
    p.fk_customer,
    p.fk_supplier,
    p.stored_at INTO v_old_slot_level_id,
    v_slot_id,
    v_level_to_remove,
    v_fk_product,
    v_fk_customer,
    v_fk_supplier,
    v_stored_at
FROM public.paloxes p
    JOIN public.stock_column_slot_levels scl ON p.fk_stock_column_slot_level = scl.id
WHERE p.id = p_palox_id FOR
UPDATE;

IF v_old_slot_level_id IS NULL THEN RAISE EXCEPTION 'palox with ID % is currently not stored in any slot.',
p_palox_id USING ERRCODE = 'YY014',
HINT = 'please check the ID, or place the palox into any stock first';

END IF;

PERFORM 1
FROM public.paloxes p
    JOIN public.stock_column_slot_levels scl ON p.fk_stock_column_slot_level = scl.id
WHERE scl.fk_stock_column_slot = v_slot_id
    AND scl.level > v_level_to_remove FOR
UPDATE;

INSERT INTO public.palox_histories (
        fk_palox,
        fk_stock_column_slot_level,
        fk_product,
        fk_customer,
        fk_supplier,
        stored_at,
        exit_at,
        created_at
    )
VALUES (
        p_palox_id,
        v_old_slot_level_id,
        v_fk_product,
        v_fk_customer,
        v_fk_supplier,
        v_stored_at,
        v_exit_at,
        v_exit_at
    );

UPDATE public.paloxes
SET fk_stock_column_slot_level = NULL,
    stored_at = NULL
WHERE id = p_palox_id;

WITH PaloxesToShift AS (
    SELECT p.id AS palox_id,
        scl_old.level AS old_level,
        ROW_NUMBER() OVER (
            ORDER BY scl_old.level ASC
        ) AS rn
    FROM public.paloxes p
        JOIN public.stock_column_slot_levels scl_old ON p.fk_stock_column_slot_level = scl_old.id
    WHERE scl_old.fk_stock_column_slot = v_slot_id
        AND scl_old.level > v_level_to_remove
),
NewLevels AS (
    SELECT id AS new_level_id,
        LEVEL AS target_level,
        ROW_NUMBER() OVER (
            ORDER BY LEVEL ASC
        ) AS rn
    FROM public.stock_column_slot_levels
    WHERE fk_stock_column_slot = v_slot_id
        AND LEVEL >= v_level_to_remove
        AND LEVEL < v_level_to_remove + (
            SELECT COUNT(*)
            FROM PaloxesToShift
        )
)
UPDATE public.paloxes p
SET fk_stock_column_slot_level = nl.new_level_id
FROM PaloxesToShift pts
    JOIN NewLevels nl ON pts.rn = nl.rn
WHERE p.id = pts.palox_id;

END;

$$;

REVOKE EXECUTE ON FUNCTION public.remove_palox_and_shift_down(integer)
FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.remove_palox_and_shift_down(integer)
FROM anon;

GRANT EXECUTE ON FUNCTION public.remove_palox_and_shift_down(integer) TO authenticated;

GRANT EXECUTE ON FUNCTION public.remove_palox_and_shift_down(integer) TO postgres;

GRANT EXECUTE ON FUNCTION public.remove_palox_and_shift_down(integer) TO service_role;