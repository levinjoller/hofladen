/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const ProductsViewSchema = z.object({
  id: z.int(),
  display_name: z.string(),
});

export type ProductsView = z.infer<typeof ProductsViewSchema>;

export const ProductsViewArraySchema = z.array(ProductsViewSchema);
