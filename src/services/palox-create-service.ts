import { supabase } from "@/supabase";
import { DropdownSearchItem } from "@/types/dropdown-search-item";
import { StockColumnSlotViewModel } from "@/types/stock-column-slot-view-model";
import { StockColumnSlotsColumnsViewArraySchema } from "@/types/generated/views/stock-column-slots-columns-view";
import { AssignPaloxToNextFreeLevelInSlotFncParamsSchema } from "@/types/generated/assign-palox-to-next-free-level-in-slot-fnc-params";
import { ProductNameArraySchema } from "@/types/schemas/product-name-schema";
import { StockNameArraySchema } from "@/types/schemas/stock-name-schema";
import { CustomerNameArraySchema } from "@/types/schemas/customer-name-schema";
import { SupplierNameArraySchema } from "@/types/schemas/supplier-name-schema";
import { PaloxesFullDisplayNameViewArraySchema } from "@/types/generated/views/paloxes-full-display-name-view";

export async function fetchPaloxes(): Promise<DropdownSearchItem[]> {
  const { data, error } = await supabase
    .from("paloxes_full_display_name_view")
    .select(`id, display_name`)
    .order("display_name", { ascending: true });
  if (error) {
    throw error;
  }
  if (!data) {
    return [];
  }
  const validationResult =
    PaloxesFullDisplayNameViewArraySchema.safeParse(data);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return validationResult.data.map(({ id, display_name }) => ({
    id,
    display_name,
  }));
}

export async function fetchSuppliers(): Promise<DropdownSearchItem[]> {
  const { data, error } = await supabase.from("suppliers").select(
    `
      id,
      person:fk_person (
        display_name
      )
    `
  );
  if (error) {
    throw error;
  }
  if (!data) {
    return [];
  }
  const validationResult = SupplierNameArraySchema.safeParse(data);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return validationResult.data
    .map((item) => ({
      id: item.id,
      display_name: item.person.display_name,
    }))
    .sort((a, b) => a.display_name.localeCompare(b.display_name));
}

export async function fetchCustomers(): Promise<DropdownSearchItem[]> {
  const { data, error } = await supabase.from("customers").select(
    `
      id,
      person:fk_person (
        display_name
      )
    `
  );
  if (error) {
    throw error;
  }
  if (!data) {
    return [];
  }
  const validationResult = CustomerNameArraySchema.safeParse(data);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return validationResult.data
    .map((item) => ({
      id: item.id,
      display_name: item.person.display_name,
    }))
    .sort((a, b) => a.display_name.localeCompare(b.display_name));
}

export async function fetchProducts(): Promise<DropdownSearchItem[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id, display_name")
    .order("display_name", { ascending: true });
  if (error) {
    throw error;
  }
  if (!data) {
    return [];
  }
  const validationResult = ProductNameArraySchema.safeParse(data);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return validationResult.data.map(({ id, display_name }) => ({
    id,
    display_name,
  }));
}

export async function fetchStocks(): Promise<DropdownSearchItem[]> {
  const { data, error } = await supabase
    .from("stocks")
    .select("id, stock")
    .order("stock", { ascending: true });
  if (error) {
    throw error;
  }
  if (!data) {
    return [];
  }
  const validationResult = StockNameArraySchema.safeParse(data);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return validationResult.data.map((item) => ({
    id: item.id,
    display_name: item.stock.toString(),
  }));
}

export async function fetchStockColumnSlots(
  stockId: number
): Promise<StockColumnSlotViewModel[]> {
  const { data, error } = await supabase
    .from("stock_column_slots_columns_view")
    .select()
    .eq("fk_stock", stockId)
    .order("stock_column_number", { ascending: true })
    .order("stock_slot_number", { ascending: true });
  if (error) {
    throw error;
  }
  if (!data) {
    return [];
  }
  const validationResult =
    StockColumnSlotsColumnsViewArraySchema.safeParse(data);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return validationResult.data.map((item) => {
    return {
      slot_id: item.stock_column_slot_id,
      display_name: `${item.stock_column_display_name}.${item.stock_slot_number}`,
      column_number: item.stock_column_number,
      free_levels: item.free_levels,
      is_full: item.is_full,
    };
  });
}

export const assignPaloxToSlot = async (params: {
  paloxId: number;
  stockColumnSlotId: number;
  productId: number;
  supplierId: number;
  customerId?: number | null;
}): Promise<void> => {
  const validatedParams =
    AssignPaloxToNextFreeLevelInSlotFncParamsSchema.safeParse({
      p_palox_id: params.paloxId,
      p_stock_column_slot_id: params.stockColumnSlotId,
      p_product_id: params.productId,
      p_supplier_id: params.supplierId,
      p_customer_id: params.customerId,
    });
  if (!validatedParams.success) {
    throw validatedParams.error;
  }
  const { data, error } = await supabase.rpc(
    "assign_palox_to_next_free_level_in_slot_fnc",
    {
      ...validatedParams.data,
      p_customer_id: validatedParams.data.p_customer_id ?? undefined,
    }
  );
  if (error) {
    throw error;
  }
  return data;
};
