import { z } from "zod";
import { SupplierSchema } from "../generated/tables/suppliers";
import { PersonSchema } from "../generated/tables/persons";

export const SupplierListSchema = z.object({
  ...SupplierSchema.omit({ fk_person: true }).shape,
  person: z.object({
    ...PersonSchema.pick({ display_name: true }).shape,
  }),
});

export const SupplierListArraySchema = z.array(SupplierListSchema);

export type SupplierList = z.infer<typeof SupplierListSchema>;
