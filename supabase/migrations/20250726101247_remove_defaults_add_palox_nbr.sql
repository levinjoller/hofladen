alter table "public"."paloxes" drop constraint "paloxes_fk_palox_types_fkey";

alter table "public"."paloxes" drop column "fk_palox_types";

alter table "public"."paloxes" add column "fk_palox_type" bigint not null default 1;
alter table "public"."paloxes" alter column "fk_palox_type" drop default;

alter table "public"."paloxes" add column "number_per_type" bigint not null default 1;
alter table "public"."paloxes" alter column "number_per_type" drop default;

alter table "public"."stock_column_slot_levels" alter column "max_level" drop default;

alter table "public"."paloxes" add constraint "paloxes_fk_palox_type_fkey" FOREIGN KEY (fk_palox_type) REFERENCES palox_types(id) not valid;

alter table "public"."paloxes" validate constraint "paloxes_fk_palox_type_fkey";

create policy "Enable read access for all users"
on "public"."palox_types"
as permissive
for select
to public
using (true);



