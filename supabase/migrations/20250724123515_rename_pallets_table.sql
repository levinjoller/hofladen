drop policy "Enable read access for all users" on "public"."pallet_histories";

drop policy "Enable read access for all users" on "public"."pallets";

revoke delete on table "public"."pallet_histories" from "anon";

revoke insert on table "public"."pallet_histories" from "anon";

revoke references on table "public"."pallet_histories" from "anon";

revoke select on table "public"."pallet_histories" from "anon";

revoke trigger on table "public"."pallet_histories" from "anon";

revoke truncate on table "public"."pallet_histories" from "anon";

revoke update on table "public"."pallet_histories" from "anon";

revoke delete on table "public"."pallet_histories" from "authenticated";

revoke insert on table "public"."pallet_histories" from "authenticated";

revoke references on table "public"."pallet_histories" from "authenticated";

revoke select on table "public"."pallet_histories" from "authenticated";

revoke trigger on table "public"."pallet_histories" from "authenticated";

revoke truncate on table "public"."pallet_histories" from "authenticated";

revoke update on table "public"."pallet_histories" from "authenticated";

revoke delete on table "public"."pallet_histories" from "service_role";

revoke insert on table "public"."pallet_histories" from "service_role";

revoke references on table "public"."pallet_histories" from "service_role";

revoke select on table "public"."pallet_histories" from "service_role";

revoke trigger on table "public"."pallet_histories" from "service_role";

revoke truncate on table "public"."pallet_histories" from "service_role";

revoke update on table "public"."pallet_histories" from "service_role";

revoke delete on table "public"."pallets" from "anon";

revoke insert on table "public"."pallets" from "anon";

revoke references on table "public"."pallets" from "anon";

revoke select on table "public"."pallets" from "anon";

revoke trigger on table "public"."pallets" from "anon";

revoke truncate on table "public"."pallets" from "anon";

revoke update on table "public"."pallets" from "anon";

revoke delete on table "public"."pallets" from "authenticated";

revoke insert on table "public"."pallets" from "authenticated";

revoke references on table "public"."pallets" from "authenticated";

revoke select on table "public"."pallets" from "authenticated";

revoke trigger on table "public"."pallets" from "authenticated";

revoke truncate on table "public"."pallets" from "authenticated";

revoke update on table "public"."pallets" from "authenticated";

revoke delete on table "public"."pallets" from "service_role";

revoke insert on table "public"."pallets" from "service_role";

revoke references on table "public"."pallets" from "service_role";

revoke select on table "public"."pallets" from "service_role";

revoke trigger on table "public"."pallets" from "service_role";

revoke truncate on table "public"."pallets" from "service_role";

revoke update on table "public"."pallets" from "service_role";

alter table "public"."pallet_histories" drop constraint "pallet_histories_fk_pallet_fkey";

alter table "public"."pallet_histories" drop constraint "pallet_histories_fk_stock_column_slot_level_fkey";

alter table "public"."pallets" drop constraint "pallets_fk_customer_fkey";

alter table "public"."pallets" drop constraint "pallets_fk_product_fkey";

alter table "public"."pallets" drop constraint "pallets_fk_stock_column_slot_level_fkey";

alter table "public"."pallets" drop constraint "pallets_fk_stock_column_slot_level_key";

alter table "public"."pallets" drop constraint "pallets_fk_supplier_fkey";

alter table "public"."pallet_histories" drop constraint "pallet_histories_pkey";

alter table "public"."pallets" drop constraint "pallets_pkey";

drop index if exists "public"."pallet_histories_pkey";

drop index if exists "public"."pallets_fk_stock_column_slot_level_key";

drop index if exists "public"."pallets_pkey";

drop table "public"."pallet_histories";

drop table "public"."pallets";

create table "public"."palox_histories" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "fk_palox" bigint not null,
    "fk_stock_column_slot_level" bigint not null
);


alter table "public"."palox_histories" enable row level security;

create table "public"."palox_types" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "label_prefix" text not null,
    "display_name" text not null,
    "description" bigint
);


alter table "public"."palox_types" enable row level security;

create table "public"."paloxes" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "fk_customer" bigint,
    "fk_product" bigint not null,
    "fk_supplier" bigint,
    "fk_stock_column_slot_level" bigint not null,
    "updated_at" timestamp without time zone default now(),
    "fk_palox_types" bigint
);


alter table "public"."paloxes" enable row level security;

CREATE UNIQUE INDEX palox_types_display_name_key ON public.palox_types USING btree (display_name);

CREATE UNIQUE INDEX palox_types_label_prefix_key ON public.palox_types USING btree (label_prefix);

CREATE UNIQUE INDEX palox_types_pkey ON public.palox_types USING btree (id);

CREATE UNIQUE INDEX pallet_histories_pkey ON public.palox_histories USING btree (id);

CREATE UNIQUE INDEX pallets_fk_stock_column_slot_level_key ON public.paloxes USING btree (fk_stock_column_slot_level);

CREATE UNIQUE INDEX pallets_pkey ON public.paloxes USING btree (id);

alter table "public"."palox_histories" add constraint "pallet_histories_pkey" PRIMARY KEY using index "pallet_histories_pkey";

alter table "public"."palox_types" add constraint "palox_types_pkey" PRIMARY KEY using index "palox_types_pkey";

alter table "public"."paloxes" add constraint "pallets_pkey" PRIMARY KEY using index "pallets_pkey";

alter table "public"."palox_histories" add constraint "pallet_histories_fk_pallet_fkey" FOREIGN KEY (fk_palox) REFERENCES paloxes(id) not valid;

alter table "public"."palox_histories" validate constraint "pallet_histories_fk_pallet_fkey";

alter table "public"."palox_histories" add constraint "pallet_histories_fk_stock_column_slot_level_fkey" FOREIGN KEY (fk_stock_column_slot_level) REFERENCES stock_column_slot_levels(id) not valid;

alter table "public"."palox_histories" validate constraint "pallet_histories_fk_stock_column_slot_level_fkey";

alter table "public"."palox_types" add constraint "palox_types_display_name_key" UNIQUE using index "palox_types_display_name_key";

alter table "public"."palox_types" add constraint "palox_types_label_prefix_key" UNIQUE using index "palox_types_label_prefix_key";

alter table "public"."paloxes" add constraint "pallets_fk_customer_fkey" FOREIGN KEY (fk_customer) REFERENCES customers(id) not valid;

alter table "public"."paloxes" validate constraint "pallets_fk_customer_fkey";

alter table "public"."paloxes" add constraint "pallets_fk_product_fkey" FOREIGN KEY (fk_product) REFERENCES products(id) not valid;

alter table "public"."paloxes" validate constraint "pallets_fk_product_fkey";

alter table "public"."paloxes" add constraint "pallets_fk_stock_column_slot_level_fkey" FOREIGN KEY (fk_stock_column_slot_level) REFERENCES stock_column_slot_levels(id) not valid;

alter table "public"."paloxes" validate constraint "pallets_fk_stock_column_slot_level_fkey";

alter table "public"."paloxes" add constraint "pallets_fk_stock_column_slot_level_key" UNIQUE using index "pallets_fk_stock_column_slot_level_key";

alter table "public"."paloxes" add constraint "pallets_fk_supplier_fkey" FOREIGN KEY (fk_supplier) REFERENCES suppliers(id) not valid;

alter table "public"."paloxes" validate constraint "pallets_fk_supplier_fkey";

alter table "public"."paloxes" add constraint "paloxes_fk_palox_types_fkey" FOREIGN KEY (fk_palox_types) REFERENCES palox_types(id) not valid;

alter table "public"."paloxes" validate constraint "paloxes_fk_palox_types_fkey";

grant delete on table "public"."palox_histories" to "anon";

grant insert on table "public"."palox_histories" to "anon";

grant references on table "public"."palox_histories" to "anon";

grant select on table "public"."palox_histories" to "anon";

grant trigger on table "public"."palox_histories" to "anon";

grant truncate on table "public"."palox_histories" to "anon";

grant update on table "public"."palox_histories" to "anon";

grant delete on table "public"."palox_histories" to "authenticated";

grant insert on table "public"."palox_histories" to "authenticated";

grant references on table "public"."palox_histories" to "authenticated";

grant select on table "public"."palox_histories" to "authenticated";

grant trigger on table "public"."palox_histories" to "authenticated";

grant truncate on table "public"."palox_histories" to "authenticated";

grant update on table "public"."palox_histories" to "authenticated";

grant delete on table "public"."palox_histories" to "service_role";

grant insert on table "public"."palox_histories" to "service_role";

grant references on table "public"."palox_histories" to "service_role";

grant select on table "public"."palox_histories" to "service_role";

grant trigger on table "public"."palox_histories" to "service_role";

grant truncate on table "public"."palox_histories" to "service_role";

grant update on table "public"."palox_histories" to "service_role";

grant delete on table "public"."palox_types" to "anon";

grant insert on table "public"."palox_types" to "anon";

grant references on table "public"."palox_types" to "anon";

grant select on table "public"."palox_types" to "anon";

grant trigger on table "public"."palox_types" to "anon";

grant truncate on table "public"."palox_types" to "anon";

grant update on table "public"."palox_types" to "anon";

grant delete on table "public"."palox_types" to "authenticated";

grant insert on table "public"."palox_types" to "authenticated";

grant references on table "public"."palox_types" to "authenticated";

grant select on table "public"."palox_types" to "authenticated";

grant trigger on table "public"."palox_types" to "authenticated";

grant truncate on table "public"."palox_types" to "authenticated";

grant update on table "public"."palox_types" to "authenticated";

grant delete on table "public"."palox_types" to "service_role";

grant insert on table "public"."palox_types" to "service_role";

grant references on table "public"."palox_types" to "service_role";

grant select on table "public"."palox_types" to "service_role";

grant trigger on table "public"."palox_types" to "service_role";

grant truncate on table "public"."palox_types" to "service_role";

grant update on table "public"."palox_types" to "service_role";

grant delete on table "public"."paloxes" to "anon";

grant insert on table "public"."paloxes" to "anon";

grant references on table "public"."paloxes" to "anon";

grant select on table "public"."paloxes" to "anon";

grant trigger on table "public"."paloxes" to "anon";

grant truncate on table "public"."paloxes" to "anon";

grant update on table "public"."paloxes" to "anon";

grant delete on table "public"."paloxes" to "authenticated";

grant insert on table "public"."paloxes" to "authenticated";

grant references on table "public"."paloxes" to "authenticated";

grant select on table "public"."paloxes" to "authenticated";

grant trigger on table "public"."paloxes" to "authenticated";

grant truncate on table "public"."paloxes" to "authenticated";

grant update on table "public"."paloxes" to "authenticated";

grant delete on table "public"."paloxes" to "service_role";

grant insert on table "public"."paloxes" to "service_role";

grant references on table "public"."paloxes" to "service_role";

grant select on table "public"."paloxes" to "service_role";

grant trigger on table "public"."paloxes" to "service_role";

grant truncate on table "public"."paloxes" to "service_role";

grant update on table "public"."paloxes" to "service_role";

create policy "Enable read access for all users"
on "public"."palox_histories"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."paloxes"
as permissive
for select
to public
using (true);



