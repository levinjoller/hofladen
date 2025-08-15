import { z } from "zod";
import { ProductSchema } from "../generated/tables/products";

export const ProductNameSchema = z.object({
  ...ProductSchema.omit({ created_at: true }).shape,
});

export const ProductNameArraySchema = z.array(ProductNameSchema);

export type ProductName = z.infer<typeof ProductNameSchema>;
