/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number().int(),
  created_at: z.preprocess(
          (val) => (typeof val === "string" ? new Date(val) : val),
          z.date()
        ),
  display_name: z.string(),
  fk_product_type: z.number().int(),
});

export type Product = z.infer<typeof ProductSchema>;

export const ProductArraySchema = z.array(ProductSchema);
