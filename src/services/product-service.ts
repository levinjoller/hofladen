import { supabase } from "@/supabase";
import { ref } from "vue";
import { presentToast } from "@/services/toast-service";
import type { Tables } from "@/types/database.types";
import { ProductListItem } from "@/types/product-list-item";

export type ProductRow = Tables<"products">;

export const products = ref<ProductListItem[]>([]);
export const productsLoading = ref(false);
export const productsError = ref<string | null>(null);

/**
 * Fetches product data once.
 * @param forceReload If true, data will be reloaded even if products.value.length > 0.
 */
export async function loadProductsForList(forceReload: boolean = false) {
  if ((products.value.length === 0 && !productsLoading.value) || forceReload) {
    productsLoading.value = true;
    productsError.value = null;
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .overrideTypes<ProductRow[], { merge: false }>();
      if (error) throw new Error(error.message);
      products.value = data.map(({ id, created_at, display_name }) => ({
        id,
        created_at,
        display_name,
      }));
    } catch (err: any) {
      productsError.value = `Fehler beim Laden der Produkte: ${err.message}`;
      presentToast(productsError.value, "danger");
    } finally {
      productsLoading.value = false;
    }
  }
}

/**
 * Reinitializes product data (useful for app resume or forced refresh).
 */
export async function reinitializeProductData() {
  products.value = [];
  productsLoading.value = true;
  productsError.value = null;
  await loadProductsForList(true);
}
