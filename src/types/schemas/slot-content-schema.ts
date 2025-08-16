import { z } from "zod";

export const SlotContentSchema = z.object({
  slot_id: z.int(),
  display_name: z.string(),
  is_full: z.boolean(),
  free_levels: z.int(),
});

export const SlotContentArraySchema = z.array(SlotContentSchema);

export type SlotContent = z.infer<typeof SlotContentSchema>;
