/**
 * NOTE: Auto-generated - DO NOT EDIT
 */

import { z } from "zod";

export const AssignPaloxToNextFreeLevelInSlotFncParamsSchema = z.object({
  p_palox_id: z.int(),
  p_stock_column_slot_id: z.int(),
  p_product_id: z.int(),
  p_supplier_id: z.int(),
  p_customer_id: z.int().nullable().optional(),
});

export type AssignPaloxToNextFreeLevelInSlotFncParams = z.infer<typeof AssignPaloxToNextFreeLevelInSlotFncParamsSchema>;
