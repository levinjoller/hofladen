import { supabase } from "@/supabase";
import { ref } from "vue";
import { presentToast } from "./toast-service";
import { Tables } from "@/types/database.types";
import { DropdownSearchItem } from "@/types/dropdown-search-item";

export type PaloxRow = Tables<"paloxes">;
export type PaloxTypeRow = Tables<"palox_types">;
export type CustomerRow = Tables<"customers">;
export type PersonRow = Tables<"persons">;
export type ProductRow = Tables<"products">;
export type SupplierRow = Tables<"suppliers">;
export type StockRow = Tables<"stocks">;

export type CustomerWithPerson = Pick<CustomerRow, "id"> & {
  persons: Pick<PersonRow, "display_name"> | null;
};

export type SupplierWithPerson = Pick<SupplierRow, "id"> & {
  persons: Pick<PersonRow, "display_name"> | null;
};

export type PaloxWithPaloxType = Pick<PaloxRow, "id" | "number_per_type"> & {
  palox_types: Pick<PaloxTypeRow, "label_prefix"> | null;
};

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

export async function fetchPaloxes(forceReload = false): Promise<void> {
  if ((paloxes.value.length === 0 && !paloxesLoading.value) || forceReload) {
    paloxesLoading.value = true;
    try {
      const { data, error } = await supabase
        .from("paloxes")
        .select(
          `
          id, 
          number_per_type, 
          palox_types:fk_palox_type (
            label_prefix
          )
          `
        )
        .is("fk_stock_column_slot_level", null)
        .overrideTypes<PaloxWithPaloxType[], { merge: false }>();
      if (error) throw error;

      paloxes.value = (data || [])
        .map((item) => ({
          id: item.id,
          display_name: getFullPaloxNumber(item),
        }))
        .sort((a, b) => a.display_name.localeCompare(b.display_name));
    } catch (e: any) {
      console.error("Fehler beim Laden der Paloxen:", e.message);
      presentToast(`Fehler beim Laden der Paloxen: ${e.message}`, "danger");
    } finally {
      paloxesLoading.value = false;
    }
  }
}

function getFullPaloxNumber(palox: PaloxWithPaloxType): string {
  const parts: string[] = [];
  if (palox.palox_types?.label_prefix) {
    parts.push(palox.palox_types.label_prefix);
  } else {
    parts.push("N/A");
  }
  parts.push(palox.number_per_type.toString().padStart(3, "0"));
  return parts.join("-");
}

export async function fetchSuppliers(forceReload = false): Promise<void> {
  if (
    (suppliers.value.length === 0 && !suppliersLoading.value) ||
    forceReload
  ) {
    suppliersLoading.value = true;
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .select("id, persons:fk_person(display_name)")
        .overrideTypes<SupplierWithPerson[], { merge: false }>();
      if (error) throw error;

      suppliers.value = (data || [])
        .map((item) => ({
          id: item.id,
          display_name: item.persons?.display_name || "N/A",
        }))
        .sort((a, b) => a.display_name.localeCompare(b.display_name));
    } catch (e: any) {
      console.error("Fehler beim Laden der Lieferanten:", e.message);
      presentToast(`Fehler beim Laden der Lieferanten: ${e.message}`, "danger");
    } finally {
      suppliersLoading.value = false;
    }
  }
}

export async function fetchCustomers(forceReload = false): Promise<void> {
  if (
    (customers.value.length === 0 && !customersLoading.value) ||
    forceReload
  ) {
    customersLoading.value = true;
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("id, persons:fk_person(display_name)")
        .overrideTypes<CustomerWithPerson[], { merge: false }>();

      if (error) throw error;

      customers.value = (data || [])
        .map((item) => ({
          id: item.id,
          display_name: item.persons?.display_name || "N/A",
        }))
        .sort((a, b) => a.display_name.localeCompare(b.display_name));
    } catch (e: any) {
      console.error("Fehler beim Laden der Kunden:", e.message);
      presentToast(`Fehler beim Laden der Kunden: ${e.message}`, "danger");
    } finally {
      customersLoading.value = false;
    }
  }
}

export async function fetchProducts(forceReload = false): Promise<void> {
  if ((products.value.length === 0 && !productsLoading.value) || forceReload) {
    productsLoading.value = true;
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, display_name")
        .order("display_name", { ascending: true })
        .overrideTypes<
          Pick<ProductRow, "id" | "display_name">[],
          { merge: false }
        >();

      if (error) throw error;

      products.value = data.map((item) => ({
        id: item.id,
        display_name: item.display_name,
      }));
    } catch (e: any) {
      console.error("Fehler beim Laden der Produkte:", e.message);
      presentToast(`Fehler beim Laden der Produkte: ${e.message}`, "danger");
    } finally {
      productsLoading.value = false;
    }
  }
}

export async function fetchStocks(forceReload = false): Promise<void> {
  if ((stocks.value.length === 0 && !stocksLoading.value) || forceReload) {
    stocksLoading.value = true;
    try {
      const { data, error } = await supabase
        .from("stocks")
        .select("id, stock")
        .order("stock", { ascending: true })
        .overrideTypes<Pick<StockRow, "id" | "stock">[], { merge: false }>();
      if (error) throw error;

      stocks.value = data.map((item) => ({
        id: item.id,
        display_name: item.stock.toString(),
      }));
    } catch (e: any) {
      console.error("Fehler beim Laden der Lager:", e.message);
      presentToast(`Fehler beim Laden der Lager: ${e.message}`, "danger");
    } finally {
      stocksLoading.value = false;
    }
  }
}
