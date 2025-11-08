import { supabase } from "@/supabase";
import { DbSlotPaloxOrderData } from "@/types/db-slot-palox-order-data";
import { GetTakenLevelCoordinatesFncParamsSchema } from "@/types/generated/get-taken-level-coordinates-fnc-params";
import { SwapPaloxesBetweenSlotsFncParamsSchema } from "@/types/generated/swap-paloxes-between-slots-fnc-params";
import { UpdatePaloxOrderBatchFncParamsSchema } from "@/types/generated/update-palox-order-batch-fnc-params";
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

export async function movePaloxesToDifferentLevel(payload: {
  p_slot_orders: DbSlotPaloxOrderData[];
}): Promise<void> {
  const validatedParams =
    UpdatePaloxOrderBatchFncParamsSchema.safeParse(payload);
  if (!validatedParams.success) {
    throw validatedParams.error;
  }
  const { error } = await supabase.rpc(
    "update_palox_order_batch_fnc",
    validatedParams.data
  );
  if (error) {
    throw error;
  }
  return;
}

export async function swapPaloxesBetweenSlots(payload: {
  p_slot_ids: number[];
}): Promise<void> {
  const validatedParams =
    SwapPaloxesBetweenSlotsFncParamsSchema.safeParse(payload);
  if (!validatedParams.success) {
    throw validatedParams.error;
  }
  const { error } = await supabase.rpc("swap_paloxes_between_slots_fnc", {
    ...validatedParams.data,
  });
  if (error) {
    throw error;
  }
  return;
}
