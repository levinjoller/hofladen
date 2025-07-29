alter table "public"."stocks" drop constraint "warehouses_display_name_key";

drop index if exists "public"."warehouses_display_name_key";

update "public"."paloxes" set "fk_supplier" = 3 where "fk_supplier" is null;
alter table "public"."paloxes" alter column "fk_supplier" set not null;

alter table "public"."stock_column_slot_levels" drop column "display_name";

alter table "public"."stock_column_slot_levels" drop column "max_level";

alter table "public"."stock_column_slot_levels" alter column "level" set data type smallint using "level"::smallint;

alter table "public"."stock_column_slots" drop column "display_name";

alter table "public"."stock_column_slots" drop column "y_position";

alter table "public"."stock_column_slots" add column "current_taken_levels" smallint not null default '0'::smallint;
alter table "public"."stock_column_slots" alter column "current_taken_levels" drop default;

alter table "public"."stock_column_slots" add column "max_level" smallint not null default '1'::smallint;
alter table "public"."stock_column_slots" alter column "max_level" drop default;

alter table "public"."stock_column_slots" add column "slot" smallint not null default '1'::smallint;
alter table "public"."stock_column_slots" alter column "slot" drop default;

alter table "public"."stock_columns" drop column "x_position";

alter table "public"."stock_columns" add column "column" smallint not null default '1'::smallint;
alter table "public"."stock_columns" alter column "column" drop default;

alter table "public"."stocks" drop column "display_name";

alter table "public"."stocks" add column "stock" smallint not null default '1'::smallint;
alter table "public"."stocks" alter column "stock" drop default;

CREATE UNIQUE INDEX stocks_stock_key ON public.stocks USING btree (stock);

alter table "public"."stocks" add constraint "stocks_stock_key" UNIQUE using index "stocks_stock_key";


