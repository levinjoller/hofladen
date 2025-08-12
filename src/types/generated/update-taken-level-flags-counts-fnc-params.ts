/**
 * NOTE: Auto-generated - DO NOT EDIT
 */

import { z } from "zod";

export const UpdateTakenLevelFlagsCountsFncParamsSchema = z.object({
  p_slot_level_id: z.int(),
  p_is_taken: z.boolean(),
});

export type UpdateTakenLevelFlagsCountsFncParams = z.infer<typeof UpdateTakenLevelFlagsCountsFncParamsSchema>;
