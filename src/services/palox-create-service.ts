import { supabase } from "@/supabase";
import { ref } from "vue";
import { DropdownSearchItem } from "@/types/dropdown-search-item";
import { StockColumnSlotViewModel } from "@/types/stock-column-slot-view-model";
import { PaloxesPaloxTypesViewArraySchema } from "@/types/generated/paloxes-palox-types-view";
import { StockColumnSlotsColumnsViewArraySchema } from "@/types/generated/stock-column-slots-columns-view";
import { SuppliersPersonsViewArraySchema } from "@/types/generated/suppliers-persons-view";
import { CustomersPersonsViewArraySchema } from "@/types/generated/customers-persons-view";
import { ProductsViewArraySchema } from "@/types/generated/products-view";
import { StocksViewArraySchema } from "@/types/generated/stocks-view";

export const paloxes = ref<DropdownSearchItem[]>([]);
export const paloxesLoading = ref(false);

export const suppliers = ref<DropdownSearchItem[]>([]);
export const suppliersLoading = ref(false);

export const customers = ref<DropdownSearchItem[]>([]);
export const customersLoading = ref(false);

export const products = ref<DropdownSearchItem[]>([]);
export const productsLoading = ref(false);

export const stocks = ref<DropdownSearchItem[]>([]);
export const stocksLoading = ref(false);

export const stockColumnSlots = ref<StockColumnSlotViewModel[]>([]);
export const stockColumnSlotsLoading = ref(false);

export async function fetchPaloxes(): Promise<DropdownSearchItem[]> {
  const { data, error } = await supabase
    .from("paloxes_palox_types_view")
    .select()
    .order("palox_types_label_prefix", { ascending: true });
  if (error) {
    throw new Error(`Fehler beim Laden der Paloxen: ${error.message}`);
  }
  if (!data) {
    return [];
  }
  const validationResult = PaloxesPaloxTypesViewArraySchema.safeParse(data);
  if (!validationResult.success) {
    const zodErrorMessage = createZodErrorMessage(
      validationResult.error.issues
    );
    throw new Error(
      `Die Daten der Paloxen entsprechen nicht dem erwarteten Format: ${zodErrorMessage}`
    );
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
    throw new Error(`Fehler beim Laden der Lieferanten: ${error.message}`);
  }
  if (!data) {
    return [];
  }
  const validationResult = SuppliersPersonsViewArraySchema.safeParse(data);
  if (!validationResult.success) {
    const zodErrorMessage = createZodErrorMessage(
      validationResult.error.issues
    );
    throw new Error(
      `Die Daten der Lieferanten entsprechen nicht dem erwarteten Format: ${zodErrorMessage}`
    );
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
    throw new Error(`Fehler beim Laden der Kunden: ${error.message}`);
  }
  if (!data) {
    return [];
  }
  const validationResult = CustomersPersonsViewArraySchema.safeParse(data);
  if (!validationResult.success) {
    const zodErrorMessage = createZodErrorMessage(
      validationResult.error.issues
    );
    throw new Error(
      `Die Daten der Kunden entsprechen nicht dem erwarteten Format: ${zodErrorMessage}`
    );
  }
  return validationResult.data.map((item) => ({
    id: item.id,
    display_name: item.person_display_name,
  }));
}

export async function fetchProducts(): Promise<DropdownSearchItem[]> {
  const { data, error } = await supabase
    .from("products")
    .select()
    .order("display_name", { ascending: true });
  if (error) {
    throw new Error(`Fehler beim Laden der Produkte: ${error.message}`);
  }
  if (!data) {
    return [];
  }
  const validationResult = ProductsViewArraySchema.safeParse(data);
  if (!validationResult.success) {
    const zodErrorMessage = createZodErrorMessage(
      validationResult.error.issues
    );
    throw new Error(
      `Die Daten der Produkte entsprechen nicht dem erwarteten Format: ${zodErrorMessage}`
    );
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
    throw new Error(`Fehler beim Laden der Lager: ${error.message}`);
  }
  if (!data) {
    return [];
  }
  const validationResult = StocksViewArraySchema.safeParse(data);
  if (!validationResult.success) {
    const zodErrorMessage = createZodErrorMessage(
      validationResult.error.issues
    );
    throw new Error(
      `Die Daten der Lager entsprechen nicht dem erwarteten Format: ${zodErrorMessage}`
    );
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
    throw new Error(`Fehler beim Laden der Lagerplätze: ${error.message}`);
  }
  if (!data) {
    return [];
  }
  const validationResult =
    StockColumnSlotsColumnsViewArraySchema.safeParse(data);
  if (!validationResult.success) {
    const zodErrorMessage = createZodErrorMessage(
      validationResult.error.issues
    );
    throw new Error(
      `Die Daten der Lagerplätze entsprechen nicht dem erwarteten Format: ${zodErrorMessage}`
    );
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

function createZodErrorMessage(issues: any[]): string {
  return issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join(", ");
}
