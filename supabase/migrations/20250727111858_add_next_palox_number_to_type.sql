alter table "public"."palox_types" add column "next_palox_number" bigint not null default '1'::bigint;
alter table "public"."palox_types" alter column "next_palox_number" drop default;

