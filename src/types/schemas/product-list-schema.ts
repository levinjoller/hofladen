import { z } from "zod";
import { ProductSchema } from "../generated/tables/products";
import { ProductTypSchema } from "../generated/tables/product-types";

export const ProductListSchema = z.object({
  ...ProductSchema.omit({ fk_product_type: true }).shape,
  type: z.object({
    ...ProductTypSchema.pick({ display_name: true, emoji: true }).shape,
  }),
});

export const ProductListArraySchema = z.array(ProductListSchema);

export type ProductList = z.infer<typeof ProductListSchema>;
