import { z } from "zod";
import { CustomerListSchema } from "./customer-list-schema";

export const CustomerNameSchema = z.object({
  ...CustomerListSchema.omit({ created_at: true }).shape,
});

export const CustomerNameArraySchema = z.array(CustomerNameSchema);

export type CustomerName = z.infer<typeof CustomerNameSchema>;
