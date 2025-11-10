/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const RemovePaloxAndShiftDownParamsSchema = z.object({
  p_palox_id: z.number().int(),
});

export type RemovePaloxAndShiftDownParams = z.infer<typeof RemovePaloxAndShiftDownParamsSchema>;
