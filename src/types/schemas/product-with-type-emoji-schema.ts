import { z } from "zod";
import { ProductSchema } from "../generated/tables/products";
import { ProductTypSchema } from "../generated/tables/product-types";

export const ProductWithTypeEmojiSchema = z.object({
  ...ProductSchema.omit({ created_at: true, fk_product_type: true }).shape,
  type: z.object({
    ...ProductTypSchema.pick({ emoji: true }).shape,
  }),
});

export const ProductWithTypeEmojiArraySchema = z.array(
  ProductWithTypeEmojiSchema
);

export type ProductWithTypeEmoji = z.infer<typeof ProductWithTypeEmojiSchema>;
