/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const GetTakenLevelCoordinatesFncParamsSchema = z.object({
  p_stock_id: z.number().int(),
});

export type GetTakenLevelCoordinatesFncParams = z.infer<typeof GetTakenLevelCoordinatesFncParamsSchema>;
