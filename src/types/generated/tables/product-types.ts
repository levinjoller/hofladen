/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const ProductTypSchema = z.object({
  id: z.number().int(),
  created_at: z.preprocess(
          (val) => (typeof val === "string" ? new Date(val) : val),
          z.date()
        ),
  display_name: z.string(),
  emoji: z.string(),
});

export type ProductTyp = z.infer<typeof ProductTypSchema>;

export const ProductTypArraySchema = z.array(ProductTypSchema);
