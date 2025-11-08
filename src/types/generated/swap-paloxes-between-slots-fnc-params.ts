/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const SwapPaloxesBetweenSlotsFncParamsSchema = z.object({
  p_slot_ids: z.array(z.number().int()).length(2),
});

export type SwapPaloxesBetweenSlotsFncParams = z.infer<typeof SwapPaloxesBetweenSlotsFncParamsSchema>;
