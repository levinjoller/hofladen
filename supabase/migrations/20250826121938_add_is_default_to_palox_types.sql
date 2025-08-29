ALTER TABLE "public"."palox_types"
ADD COLUMN "is_default" boolean NOT NULL DEFAULT false;

DROP VIEW IF EXISTS public.paloxes_full_display_name_view;