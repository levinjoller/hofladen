/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";
import { SlotPaloxOrderDataArraySchema } from "@/types/schemas/slot-palox-order-data-schema";

export const UpdatePaloxOrderBatchFncParamsSchema = z.object({
  p_slot_orders: SlotPaloxOrderDataArraySchema,
});

export type UpdatePaloxOrderBatchFncParams = z.infer<typeof UpdatePaloxOrderBatchFncParamsSchema>;
