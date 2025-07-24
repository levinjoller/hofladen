import { supabase } from "@/supabase";
import { ref } from "vue";
import { presentToast } from "./toast-service";
import { Tables } from "@/types/database.types";
import { AgGridPaloxRow } from "@/types/ag-grid-palox-row";

export type CustomerRow = Tables<"customers">;
export type PersonRow = Tables<"persons">;
export type ProductRow = Tables<"products">;
export type SupplierRow = Tables<"suppliers">;
export type StockColumnSlotLevelRow = Tables<"stock_column_slot_levels">;
export type StockColumnSlotRow = Tables<"stock_column_slots">;
export type StockColumnRow = Tables<"stock_columns">;
export type StockRow = Tables<"stocks">;
export type PaloxRow = Tables<"paloxes">;

export type CustomerWithPerson = {
  person: Pick<PersonRow, "display_name"> | null;
};

export type SupplierWithPerson = {
  person: Pick<PersonRow, "display_name"> | null;
};

export type ProductWithName = Pick<ProductRow, "display_name">;

export type StockColumnSlotLevelWithRelations = Pick<
  StockColumnSlotLevelRow,
  "display_name"
> & {
  stock_column_slot: Pick<StockColumnSlotRow, "display_name"> & {
    stock_column: Pick<StockColumnRow, "display_name"> & {
      stock: Pick<StockRow, "display_name">;
    };
  };
};

export type PaloxWithRelations = Pick<PaloxRow, "id" | "created_at"> & {
  customer: CustomerWithPerson | null;
  product: ProductWithName | null;
  supplier: SupplierWithPerson | null;
  stock_column_slot_level: StockColumnSlotLevelWithRelations | null;
};
export const paloxes = ref<AgGridPaloxRow[]>([]);
export const paloxesLoading = ref(false);
export const paloxesError = ref<string | null>(null);

export async function loadpaloxesForList(forceReload = false) {
  if ((paloxes.value.length === 0 && !paloxesLoading.value) || forceReload) {
    paloxesLoading.value = true;
    paloxesError.value = null;

    try {
      const { data, error } = await supabase
        .from("paloxes")
        .select(
          `
          id,
          created_at,
          customer:fk_customer (
            person:fk_person (
              display_name
            )
          ),
          product:fk_product (
            display_name
          ),
          supplier:fk_supplier (
            person:fk_person (
              display_name
            )
          ),
          stock_column_slot_level:fk_stock_column_slot_level (
            display_name,
            stock_column_slot:fk_stock_column_slot (
              display_name,
              stock_column:fk_stock_column (
                display_name,
                stock:fk_stock (
                  display_name
                )
              )
            )
          )
        `
        )
        .overrideTypes<PaloxWithRelations[], { merge: false }>();

      if (error) throw error;

      paloxes.value = (data || []).map((palox) => {
        const customerName = palox.customer?.person?.display_name || null;
        const productName = palox.product?.display_name || null;
        const supplierName = palox.supplier?.person?.display_name || null;

        return {
          palox_id: palox.id,
          created_at: palox.created_at,
          customer_name: customerName,
          product_name: productName,
          supplier_name: supplierName,
          stock_column_row_level: getFullStockLocationName(
            palox.stock_column_slot_level
          ),
        };
      });
    } catch (err: any) {
      paloxesError.value = err.message || "Unbekannter Fehler";
      presentToast(`Fehler beim Laden der Paletten: ${err.message}`, "danger");
    } finally {
      paloxesLoading.value = false;
    }
  }
}

function getFullStockLocationName(
  slotLevel: StockColumnSlotLevelWithRelations | null
): string | null {
  if (!slotLevel) return null;
  const parts: string[] = [
    slotLevel.stock_column_slot.stock_column.stock.display_name,
    slotLevel.stock_column_slot.stock_column.display_name,
    slotLevel.stock_column_slot.display_name,
    slotLevel.display_name,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(".") : null;
}
