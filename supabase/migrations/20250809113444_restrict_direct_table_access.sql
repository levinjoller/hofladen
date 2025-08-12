ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.palox_histories ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.palox_types ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.paloxes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.stock_column_slot_levels ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.stock_column_slots ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.stock_columns ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES
FROM public;

ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS
FROM public;

ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES
FROM public;

REVOKE ALL ON ALL TABLES IN SCHEMA public
FROM public;

REVOKE ALL ON ALL SEQUENCES IN SCHEMA public
FROM public;

REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public
FROM public;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.customers;

REVOKE
INSERT,
    UPDATE,
    DELETE ON public.customers
FROM public;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.palox_histories;

REVOKE
INSERT,
    UPDATE,
    DELETE ON public.palox_histories
FROM public;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.palox_types;

REVOKE
INSERT,
    UPDATE,
    DELETE ON public.palox_types
FROM public;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.paloxes;

REVOKE
INSERT,
    UPDATE,
    DELETE ON public.paloxes
FROM public;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.persons;

REVOKE
INSERT,
    UPDATE,
    DELETE ON public.persons
FROM public;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;

REVOKE
INSERT,
    UPDATE,
    DELETE ON public.products
FROM public;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.stock_column_slot_levels;

REVOKE
INSERT,
    UPDATE,
    DELETE ON public.stock_column_slot_levels
FROM public;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.stock_column_slots;

REVOKE
INSERT,
    UPDATE,
    DELETE ON public.stock_column_slots
FROM public;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.stock_columns;

REVOKE
INSERT,
    UPDATE,
    DELETE ON public.stock_columns
FROM public;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.stocks;

REVOKE
INSERT,
    UPDATE,
    DELETE ON public.stocks
FROM public;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.suppliers;

REVOKE
INSERT,
    UPDATE,
    DELETE ON public.suppliers
FROM public;

REVOKE
SELECT ON public.customers_persons_view
FROM public;

REVOKE
SELECT ON public.paloxes_palox_types_view
FROM public;

REVOKE
SELECT ON public.products_view
FROM public;

REVOKE
SELECT ON public.stock_column_slots_columns_view
FROM public;

REVOKE
SELECT ON public.stocks_view
FROM public;

REVOKE
SELECT ON public.suppliers_persons_view
FROM public;

REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public
FROM public;

REVOKE EXECUTE ON FUNCTION public.assign_palox_to_next_free_level_in_slot_fnc(BIGINT, BIGINT, BIGINT, BIGINT, BIGINT)
FROM public;

ALTER PUBLICATION supabase_realtime DROP TABLE public.customers;

ALTER PUBLICATION supabase_realtime DROP TABLE public.persons;

ALTER PUBLICATION supabase_realtime DROP TABLE public.products;

ALTER PUBLICATION supabase_realtime DROP TABLE public.stock_column_slot_levels;

ALTER PUBLICATION supabase_realtime DROP TABLE public.suppliers;