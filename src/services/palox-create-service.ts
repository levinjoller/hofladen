import { supabase } from "@/supabase";
import { DropdownSearchItem } from "@/types/dropdown-search-item";
import { StockColumnSlotViewModel } from "@/types/stock-column-slot-view-model";
import { PaloxesPaloxTypesViewArraySchema } from "@/types/generated/paloxes-palox-types-view";
import { StockColumnSlotsColumnsViewArraySchema } from "@/types/generated/stock-column-slots-columns-view";
import { SuppliersPersonsViewArraySchema } from "@/types/generated/suppliers-persons-view";
import { CustomersPersonsViewArraySchema } from "@/types/generated/customers-persons-view";
import { ProductsViewArraySchema } from "@/types/generated/products-view";
import { StocksViewArraySchema } from "@/types/generated/stocks-view";
import { AssignPaloxToNextFreeLevelInSlotFncParamsSchema } from "@/types/generated/assign-palox-to-next-free-level-in-slot-fnc-params";

export async function fetchPaloxes(): Promise<DropdownSearchItem[]> {
  const { data, error } = await supabase
    .from("paloxes_palox_types_view")
    .select()
    .order("palox_types_label_prefix", { ascending: true });
  if (error) {
    throw error;
  }
  if (!data) {
    return [];
  }
  const validationResult = PaloxesPaloxTypesViewArraySchema.safeParse(data);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return validationResult.data.map((item) => ({
    id: item.id,
    display_name: `${item.palox_types_label_prefix}-${item.number_per_type
      .toString()
      .padStart(3, "0")}`,
  }));
}

export async function fetchSuppliers(): Promise<DropdownSearchItem[]> {
  const { data, error } = await supabase
    .from("suppliers_persons_view")
    .select()
    .order("person_display_name", { ascending: true });
  if (error) {
    throw error;
  }
  if (!data) {
    return [];
  }
  const validationResult = SuppliersPersonsViewArraySchema.safeParse(data);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return validationResult.data.map((item) => ({
    id: item.id,
    display_name: item.person_display_name,
  }));
}

export async function fetchCustomers(): Promise<DropdownSearchItem[]> {
  const { data, error } = await supabase
    .from("customers_persons_view")
    .select()
    .order("person_display_name", { ascending: true });
  if (error) {
    throw error;
  }
  if (!data) {
    return [];
  }
  const validationResult = CustomersPersonsViewArraySchema.safeParse(data);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return validationResult.data.map((item) => ({
    id: item.id,
    display_name: item.person_display_name,
  }));
}

export async function fetchProducts(): Promise<DropdownSearchItem[]> {
  const { data, error } = await supabase
    .from("products_view")
    .select()
    .order("display_name", { ascending: true });
  if (error) {
    throw error;
  }
  if (!data) {
    return [];
  }
  const validationResult = ProductsViewArraySchema.safeParse(data);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return validationResult.data.map((item) => ({
    id: item.id,
    display_name: item.display_name,
  }));
}

export async function fetchStocks(): Promise<DropdownSearchItem[]> {
  const { data, error } = await supabase
    .from("stocks_view")
    .select()
    .order("stock", { ascending: true });
  if (error) {
    throw error;
  }
  if (!data) {
    return [];
  }
  const validationResult = StocksViewArraySchema.safeParse(data);
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
