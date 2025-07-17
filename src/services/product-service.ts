import { supabase } from "@/supabase";
import { ref } from "vue";
import { presentToast } from "@/services/toast-service";
import { Product } from "@/types/product";

export const products = ref<Product[]>([]);
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
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        throw new Error(error.message);
      }
      products.value = data || [];
    } catch (err: any) {
      productsError.value = `Fehler beim Laden der Produkte: ${err.message}`;
      console.error("Error loading products:", err);
      presentToast(productsError.value, "danger");
    } finally {
      productsLoading.value = false;
    }
  }
}

/**
 * Reinitializes product data (useful for app resume or forced refresh).
 * This function is called when the app comes back into foreground or on a pull-to-refresh.
 * It ensures data is fresh.
 */
export async function reinitializeProductData() {
  products.value = [];
  productsLoading.value = true;
  productsError.value = null;
  await loadProductsForList(true);
  console.log("Reinitialized product data (no Realtime subscription).");
}
