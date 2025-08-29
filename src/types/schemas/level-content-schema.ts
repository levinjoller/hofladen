import { z } from "zod";

export const LevelContentSchema = z.object({
  level: z.int(),
  palox_id: z.int(),
  display_name: z.string(),
});

export const LevelContentArraySchema = z.array(LevelContentSchema);

export type LevelContent = z.infer<typeof LevelContentSchema>;
