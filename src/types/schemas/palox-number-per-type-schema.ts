import { z } from "zod";
import { PaloxSchema } from "../generated/tables/paloxes";

export const PaloxNumberPerTypeSchema = z.object({
  ...PaloxSchema.pick({ id: true, number_per_type: true }).shape,
});

export const PaloxNumberPerTypeArraySchema = z.array(PaloxNumberPerTypeSchema);

export type PaloxNumberPerType = z.infer<typeof PaloxNumberPerTypeSchema>;
