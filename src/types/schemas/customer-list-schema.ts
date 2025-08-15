import { z } from "zod";
import { CustomerSchema } from "../generated/tables/customers";
import { PersonSchema } from "../generated/tables/persons";

export const CustomerListSchema = z.object({
  ...CustomerSchema.omit({ fk_person: true }).shape,
  person: z.object({
    ...PersonSchema.pick({ display_name: true }).shape,
  }),
});

export const CustomerListArraySchema = z.array(CustomerListSchema);

export type CustomerList = z.infer<typeof CustomerListSchema>;
