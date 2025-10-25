import { supabase } from "@/supabase";
import { DropdownSearchItem } from "@/types/dropdown-search-item";
import { AssignPaloxToNextFreeLevelInSlotFncParamsSchema } from "@/types/generated/assign-palox-to-next-free-level-in-slot-fnc-params";
import { ProductWithTypeEmojiArraySchema } from "@/types/schemas/product-with-type-emoji-schema";
import { StockNameArraySchema } from "@/types/schemas/stock-name-schema";
import { CustomerNameArraySchema } from "@/types/schemas/customer-name-schema";
import { SupplierNameArraySchema } from "@/types/schemas/supplier-name-schema";
import {
  StockColumnSlotsByColumnView,
  StockColumnSlotsByColumnViewArraySchema,
} from "@/types/generated/views/stock-column-slots-by-column-view";
import {
  PaloxesNameBySlotView,
  PaloxesNameBySlotViewArraySchema,
} from "@/types/generated/views/paloxes-name-by-slot-view";
import { PaloxTypeNameArraySchema } from "@/types/schemas/palox-type-name-schema";
import { PaloxNumberPerTypeArraySchema } from "@/types/schemas/palox-number-per-type-schema";

export async function fetchPaloxes(
  paloxNumber: number,
  paloxTypeId: number
): Promise<DropdownSearchItem[]> {
  let query = supabase
    .from("paloxes")
    .select(`id, number_per_type`)
    .eq("fk_palox_type", paloxTypeId)
    .eq("number_per_type", paloxNumber)
    .is("fk_stock_column_slot_level", null)
    .order("number_per_type", { ascending: true })
    .limit(5);
  const { data, error } = await query;
  if (error) {
    throw error;
  }
  if (!data) {
    return [];
  }
  const validationResult = PaloxNumberPerTypeArraySchema.safeParse(data);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return validationResult.data.map((item) => ({
    id: item.id,
    display_name: item.number_per_type.toString(),
  }));
}

export async function fetchSuppliers(
  searchTerm: string = ""
): Promise<DropdownSearchItem[]> {
  let query = supabase.from("suppliers").select(
    `
      id,
      person:fk_person!inner (
        display_name
      )
    `
  );
  let transformedSearchTerm = searchTerm.trim();
  if (transformedSearchTerm) {
    query = query
      .ilike("person.display_name", `%${transformedSearchTerm}%`)
      .limit(5);
  }
  const { data, error } = await query;
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

export async function fetchCustomers(
  searchTerm: string = ""
): Promise<DropdownSearchItem[]> {
  let query = supabase.from("customers").select(
    `
      id,
      person:fk_person!inner (
        display_name
      )
    `
  );
  let transformedSearchTerm = searchTerm.trim();
  if (transformedSearchTerm) {
    query = query
      .ilike("person.display_name", `%${transformedSearchTerm}%`)
      .limit(5);
  }
  const { data, error } = await query;
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

export async function fetchProducts(
  searchTerm: string = ""
): Promise<DropdownSearchItem[]> {
  let query = supabase
    .from("products")
    .select(
      `
      id, 
      display_name,
      type:fk_product_type (
        emoji
      )
      `
    )
    .order("display_name", { ascending: true });
  let transformedSearchTerm = searchTerm.trim();
  if (transformedSearchTerm) {
    query = query.ilike("display_name", `%${transformedSearchTerm}%`).limit(5);
  }
  const { data, error } = await query;
  if (error) {
    throw error;
  }
  if (!data) {
    return [];
  }
  const validationResult = ProductWithTypeEmojiArraySchema.safeParse(data);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return validationResult.data.map((item) => ({
    id: item.id,
    display_name: `${item.type.emoji} ${item.display_name}`,
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

export async function fetchPaloxTypes(
  defaultOnly?: boolean
): Promise<DropdownSearchItem[]> {
  let query = supabase
    .from("palox_types")
    .select("id, label_prefix, display_name, is_default")
    .order("is_default", { ascending: false })
    .order("label_prefix", { ascending: true });
  if (defaultOnly) {
    query = query.eq("is_default", true).limit(1);
  }
  const { data, error } = await query;
  if (error) {
    throw error;
  }
  if (!data) {
    return [];
  }
  const validationResult = PaloxTypeNameArraySchema.safeParse(data);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return validationResult.data.map((item) => ({
    id: item.id,
    display_name: `${item.label_prefix} (${item.display_name})`,
  }));
}

export async function fetchStockColumnSlotsByColumn(
  stockId: number
): Promise<StockColumnSlotsByColumnView[]> {
  const { data, error } = await supabase
    .from("stock_column_slots_by_column_view")
    .select()
    .eq("fk_stock", stockId)
    .order("column_number", { ascending: true });
  if (error) {
    throw error;
  }
  if (!data) {
    return [];
  }
  const validationResult =
    StockColumnSlotsByColumnViewArraySchema.safeParse(data);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return validationResult.data;
}

export const assignPaloxToSlot = async (params: {
  paloxTypeId: number;
  paloxNumber: number;
  stockColumnSlotId: number;
  productId: number;
  supplierId: number;
  customerId?: number | null;
}): Promise<void> => {
  const validatedParams =
    AssignPaloxToNextFreeLevelInSlotFncParamsSchema.safeParse({
      p_palox_type_id: params.paloxTypeId,
      p_palox_number: params.paloxNumber,
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

export async function fetchPaloxesNameBySlot(
  slotIds: number | number[]
): Promise<PaloxesNameBySlotView[]> {
  let query = supabase
    .from("paloxes_name_by_slot_view")
    .select()
    .order("slot", { ascending: true });
  if (Array.isArray(slotIds)) {
    query = query.in("slot_id", slotIds);
  } else {
    query = query.eq("slot_id", slotIds);
  }
  const { data, error } = await query;
  if (error) {
    throw error;
  }
  if (!data) {
    return [];
  }
  const validationResult = PaloxesNameBySlotViewArraySchema.safeParse(data);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return validationResult.data;
}
