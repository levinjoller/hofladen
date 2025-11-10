import { supabase } from "@/supabase";
import { RemovePaloxAndShiftDownParamsSchema } from "@/types/generated/remove-palox-and-shift-down-params";

export async function removePaloxFromStock(payload: {
  p_palox_id: number;
}): Promise<void> {
  const validatedParams =
    RemovePaloxAndShiftDownParamsSchema.safeParse(payload);
  if (!validatedParams.success) {
    throw validatedParams.error;
  }
  const { error } = await supabase.rpc("remove_palox_and_shift_down", {
    ...validatedParams.data,
  });
  if (error) {
    throw error;
  }
  return;
}
