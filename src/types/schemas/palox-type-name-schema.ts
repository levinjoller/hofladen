import { z } from "zod";
import { PaloxTypSchema } from "../generated/tables/palox-types";

export const PaloxTypeNameSchema = z.object({
  ...PaloxTypSchema.pick({
    id: true,
    label_prefix: true,
    display_name: true,
    is_default: true,
  }).shape,
});

export const PaloxTypeNameArraySchema = z.array(PaloxTypeNameSchema);

export type PaloxTypeName = z.infer<typeof PaloxTypeNameSchema>;
