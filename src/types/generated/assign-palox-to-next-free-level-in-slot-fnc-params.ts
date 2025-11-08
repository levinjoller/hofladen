/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const AssignPaloxToNextFreeLevelInSlotFncParamsSchema = z.object({
  p_palox_type_id: z.number().int(),
  p_palox_number: z.number().int().min(1).max(9999),
  p_stock_column_slot_id: z.number().int(),
  p_product_id: z.number().int(),
  p_supplier_id: z.number().int(),
  p_customer_id: z.number().int().nullable().optional(),
});

export type AssignPaloxToNextFreeLevelInSlotFncParams = z.infer<typeof AssignPaloxToNextFreeLevelInSlotFncParamsSchema>;
