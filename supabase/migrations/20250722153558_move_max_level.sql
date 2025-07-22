alter table "public"."stock_column_slot_levels" add column "max_level" smallint not null default '1'::smallint;

alter table "public"."stock_column_slots" drop column "max_level";


