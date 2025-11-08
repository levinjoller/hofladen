import { z } from "zod";

export const SlotContentSchema = z.object({
  slot_id: z.number().int(),
  display_name: z.string(),
  is_full: z.boolean(),
  free_levels: z.number().int(),
  current_taken_levels: z.number().int(),
});

export const SlotContentArraySchema = z.array(SlotContentSchema);

export type SlotContent = z.infer<typeof SlotContentSchema>;
