import { z } from "zod";

export const CoordinateSchema = z.object({
  slot_level_id: z.int(),
  x_column: z.int(),
  y_level: z.int(),
  z_slot: z.int(),
});

export const CoordinateArraySchema = z.array(CoordinateSchema);

export type Coordinate = z.infer<typeof CoordinateSchema>;
