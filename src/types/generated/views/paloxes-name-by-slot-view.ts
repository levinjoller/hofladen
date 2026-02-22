/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";
import { LevelContentArraySchema } from "@/types/schemas/level-content-schema";

export const PaloxesNameBySlotViewSchema = z.object({
  slot_id: z.number().int(),
  slot_display_name: z.string(),
  column: z.number().int(),
  slot: z.number().int(),
  max_level: z.number().int(),
  levels: LevelContentArraySchema,
});

export type PaloxesNameBySlotView = z.infer<typeof PaloxesNameBySlotViewSchema>;

export const PaloxesNameBySlotViewArraySchema = z.array(PaloxesNameBySlotViewSchema);
