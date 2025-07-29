alter index if exists "public"."pallet_histories_pkey" rename to "palox_histories_pkey";

alter index if exists "public"."pallets_fk_stock_column_slot_level_key" rename to "paloxes_fk_stock_column_slot_level_key";

alter index if exists "public"."pallets_pkey" rename to "paloxes_pkey";

alter index if exists "public"."person_display_name_key" rename to "persons_display_name_key";

alter index if exists "public"."person_pkey" rename to "persons_pkey";

alter index if exists "public"."product_pkey" rename to "products_pkey";

alter index if exists "public"."slot_levels_pkey" rename to "stock_column_slot_levels_pkey";

alter index if exists "public"."column_spots_pkey" rename to "stock_column_slots_pkey";

alter index if exists "public"."rows_pkey" rename to "stock_columns_pkey";

alter index if exists "public"."warehouse_pkey" rename to "stocks_pkey";

alter table "public"."palox_histories" rename constraint "pallet_histories_fk_pallet_fkey" to "palox_histories_fk_palox_fkey";
alter table "public"."palox_histories" rename constraint "pallet_histories_fk_stock_column_slot_level_fkey" to "palox_histories_fk_stock_column_slot_level_fkey";

alter table "public"."paloxes" rename constraint "pallets_fk_customer_fkey" to "paloxes_fk_customer_fkey";
alter table "public"."paloxes" rename constraint "pallets_fk_product_fkey" to "paloxes_fk_product_fkey";
alter table "public"."paloxes" rename constraint "pallets_fk_stock_column_slot_level_fkey" to "paloxes_fk_stock_column_slot_level_fkey";
alter table "public"."paloxes" rename constraint "pallets_fk_supplier_fkey" to "paloxes_fk_supplier_fkey";

alter table "public"."stock_columns" rename constraint "rows_fk_warehouse_fkey" to "stock_columns_fk_stock_fkey";

alter table "public"."stock_columns" drop constraint if exists "rows_display_name_key";
drop index if exists "public"."rows_display_name_key";
