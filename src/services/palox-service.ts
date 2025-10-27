import { supabase } from "@/supabase";
import { GetTakenLevelCoordinatesFncParamsSchema } from "@/types/generated/get-taken-level-coordinates-fnc-params";
import {
  PaloxesInStockView,
  PaloxesInStockViewArraySchema,
} from "@/types/generated/views/paloxes-in-stock-view";
import {
  Coordinate,
  CoordinateArraySchema,
} from "@/types/schemas/coordinate-schema";

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

export async function fetchTakenLevelCoordinates(params: {
  stockId: number;
}): Promise<Coordinate[]> {
  const validatedParams = GetTakenLevelCoordinatesFncParamsSchema.safeParse({
    p_stock_id: params.stockId,
  });
  if (!validatedParams.success) {
    throw validatedParams.error;
  }
  const { data, error } = await supabase.rpc(
    "get_taken_level_coordinates_fnc",
    validatedParams.data
  );
  if (error) {
    throw error;
  }
  if (!data) {
    return [];
  }
  const validationResult = CoordinateArraySchema.safeParse(data);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return validationResult.data;
}
