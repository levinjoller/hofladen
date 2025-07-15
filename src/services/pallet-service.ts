import { supabase } from "@/supabase";
import { ref } from "vue";
import { presentToast } from "./toastService";
import { AgGridPalletRow } from "@/types/ag-grid-pallet-row";

export const pallets = ref<AgGridPalletRow[]>([]);
export const palletsLoading = ref(false);
export const palletsError = ref<string | null>(null);

export async function loadPalletsForOverview(forceReload: boolean = false) {
  if ((pallets.value.length === 0 && !palletsLoading.value) || forceReload) {
    palletsLoading.value = true;
    palletsError.value = null;
    try {
      const { data, error } = await supabase.from("pallets").select(`
          id,
          created_at,
          customers:fk_customer (
            person:fk_person (
              display_name
            )
          ),
          products:fk_product (
            display_name
          ),
          suppliers:fk_supplier (
            person:fk_person (
              display_name
            )
          ),
          stock_column_slot_levels:fk_stock_column_slot_level (
            display_name,
            stock_column_slots:fk_stock_column_slot (
              display_name,
              stock_columns:fk_stock_column (
                display_name,
                stocks:fk_stock (
                  display_name
                )
              )
            )
          )`);
      if (error) throw error;
      pallets.value = (data || []).map((pallet: any) => {
        return {
          pallet_id: pallet.id,
          created_at: pallet.created_at,
          customer_name: pallet.customers?.person?.display_name || null,
          product_name: pallet.products?.display_name || null,
          supplier_name: pallet.suppliers?.person?.display_name || null,
          stock_column_row_level: getFullStockLocationName(
            pallet.stock_column_slot_levels
          ),
        };
      });
    } catch (err: any) {
      console.error("Fehler beim Laden der Paloxen:", err.message);
      palletsError.value = err.message || "Unbekannter Fehler";
      presentToast(`Fehler beim Laden der Paloxen: ${err.message}`, "danger");
    } finally {
      palletsLoading.value = false;
    }
  }
}

const getFullStockLocationName = (slotLevelData: any): string | null => {
  if (!slotLevelData) {
    return null;
  }
  const parts: string[] = [];
  const stock =
    slotLevelData.stock_column_slots?.stock_columns?.stocks?.display_name;
  const column = slotLevelData.stock_column_slots?.stock_columns?.display_name;
  const row = slotLevelData.stock_column_slots?.display_name;
  const level = slotLevelData.display_name;
  if (stock) {
    parts.push(stock);
  }
  if (column) {
    parts.push(column);
  }
  if (row) {
    parts.push(row);
  }
  if (level) {
    parts.push(level);
  }
  return parts.length > 0 ? parts.join(".") : null;
};
