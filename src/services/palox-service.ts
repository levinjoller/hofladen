import { supabase } from "@/supabase";
import {
  PaloxesInStockView,
  PaloxesInStockViewArraySchema,
} from "@/types/generated/paloxes-in-stock-view";

export async function fetchPaloxesInStock(): Promise<PaloxesInStockView[]> {
  const { data, error } = await supabase
    .from("paloxes_in_stock_view")
    .select()
    .order("palox_display_name", { ascending: true });
  if (error) {
    throw error;
  }
  if (!data) {
    return [];
  }
  const validationResult = PaloxesInStockViewArraySchema.safeParse(data);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return validationResult.data;
}
