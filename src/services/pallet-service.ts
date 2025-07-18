import { supabase } from "@/supabase";
import { ref } from "vue";
import { presentToast } from "./toast-service";
import { Tables } from "@/types/database.types";
import { AgGridPalletRow } from "@/types/ag-grid-pallet-row";

export type CustomerRow = Tables<"customers">;
export type PersonRow = Tables<"persons">;
export type ProductRow = Tables<"products">;
export type SupplierRow = Tables<"suppliers">;
export type StockColumnSlotLevelRow = Tables<"stock_column_slot_levels">;
export type StockColumnSlotRow = Tables<"stock_column_slots">;
export type StockColumnRow = Tables<"stock_columns">;
export type StockRow = Tables<"stocks">;
export type PalletRow = Tables<"pallets">;

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

export type PalletWithRelations = Pick<PalletRow, "id" | "created_at"> & {
  customer: CustomerWithPerson | null;
  product: ProductWithName | null;
  supplier: SupplierWithPerson | null;
  stock_column_slot_level: StockColumnSlotLevelWithRelations | null;
};
export const pallets = ref<AgGridPalletRow[]>([]);
export const palletsLoading = ref(false);
export const palletsError = ref<string | null>(null);

export async function loadPalletsForList(forceReload = false) {
  if ((pallets.value.length === 0 && !palletsLoading.value) || forceReload) {
    palletsLoading.value = true;
    palletsError.value = null;

    try {
      const { data, error } = await supabase
        .from("pallets")
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
        .overrideTypes<PalletWithRelations[], { merge: false }>();

      if (error) throw error;

      pallets.value = (data || []).map((pallet) => {
        const customerName = pallet.customer?.person?.display_name || null;
        const productName = pallet.product?.display_name || null;
        const supplierName = pallet.supplier?.person?.display_name || null;

        return {
          pallet_id: pallet.id,
          created_at: pallet.created_at,
          customer_name: customerName,
          product_name: productName,
          supplier_name: supplierName,
          stock_column_row_level: getFullStockLocationName(
            pallet.stock_column_slot_level
          ),
        };
      });
    } catch (err: any) {
      palletsError.value = err.message || "Unbekannter Fehler";
      presentToast(`Fehler beim Laden der Paletten: ${err.message}`, "danger");
    } finally {
      palletsLoading.value = false;
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
