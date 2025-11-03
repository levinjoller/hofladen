import z from "zod";

export const SlotPaloxOrderDataSchema = z.object({
  slot_id: z.int(),
  ordered_palox_ids: z.array(z.int()),
});

export const SlotPaloxOrderDataArraySchema = z.array(SlotPaloxOrderDataSchema);

export type SlotPaloxOrderData = z.infer<typeof SlotPaloxOrderDataSchema>;
