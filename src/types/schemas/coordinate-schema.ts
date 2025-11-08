import { z } from "zod";

export const CoordinateSchema = z.object({
  slot_level_id: z.number().int(),
  x_column: z.number().int(),
  y_level: z.number().int(),
  z_slot: z.number().int(),
});

export const CoordinateArraySchema = z.array(CoordinateSchema);

export type Coordinate = z.infer<typeof CoordinateSchema>;
