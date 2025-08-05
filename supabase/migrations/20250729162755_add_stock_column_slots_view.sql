create or replace view "public"."stock_column_slots_columns_view" as
select
    sc.id as stock_column_id,
    sc.fk_stock,
    sc.column as stock_column_number,
    sc.display_name as stock_column_display_name,
    scs.id as stock_column_slot_id,
    scs.slot as stock_slot_number,
    (scs.current_taken_levels >= scs.max_level) as is_full,
    (scs.max_level - scs.current_taken_levels) as free_levels
from
    "public"."stock_columns" sc
join
    "public"."stock_column_slots" scs on sc.id = scs.fk_stock_column;

create or replace view "public"."customers_persons_view" as
select
  c.id,
  p.display_name as person_display_name
from
  "public"."customers" c
join
  "public"."persons" p on c.fk_person = p.id;

create or replace view "public"."suppliers_persons_view" as
select
  s.id,
  p.display_name as person_display_name
from
  "public"."suppliers" s
join
  "public"."persons" p on s.fk_person = p.id;

create or replace view "public"."paloxes_palox_types_view" as
select
  p.id,
  p.number_per_type,
  p.fk_stock_column_slot_level,
  pt.label_prefix as palox_types_label_prefix
from
  "public"."paloxes" p
join
  "public"."palox_types" pt on p.fk_palox_type = pt.id
WHERE
  p.fk_stock_column_slot_level IS NOT NULL;

create or replace view "public"."products_view" as
select
  id,
  display_name
from
  "public"."products";

create or replace view "public"."stocks_view" as
select
  id,
  stock
from
  "public"."stocks";