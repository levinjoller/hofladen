/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const DoUpdateTakenLevelsFncParamsSchema = z.object({
  p_affected_level_ids: z.any(),
});

export type DoUpdateTakenLevelsFncParams = z.infer<typeof DoUpdateTakenLevelsFncParamsSchema>;
