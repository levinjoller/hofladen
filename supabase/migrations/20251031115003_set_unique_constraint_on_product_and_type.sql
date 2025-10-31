ALTER TABLE public.products DROP CONSTRAINT products_display_name_key;

ALTER TABLE public.products
ADD CONSTRAINT products_display_name_type_key UNIQUE (fk_product_type, display_name);