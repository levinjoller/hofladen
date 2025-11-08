import { z } from "zod";

export const LevelContentSchema = z.object({
  level: z.number().int(),
  palox_id: z.number().int(),
  display_name: z.string(),
});

export const LevelContentArraySchema = z.array(LevelContentSchema);

export type LevelContent = z.infer<typeof LevelContentSchema>;
