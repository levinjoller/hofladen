import { supabase } from "@/supabase";
import { ref } from "vue";
import { presentToast } from "@/services/toast-service";
import { Tables } from "@/types/database.types";
import { SupplierListItem } from "@/types/supplier-list-item";

type SupplierRow = Tables<"suppliers">;
type PersonRow = Tables<"persons">;

type SupplierWithPerson = SupplierRow & {
  person: Pick<PersonRow, "id" | "display_name"> | null;
};

export const suppliers = ref<SupplierListItem[]>([]);
export const suppliersLoading = ref(false);
export const suppliersError = ref<string | null>(null);

export async function loadSuppliersForList(forceReload = false) {
  if (
    (suppliers.value.length === 0 && !suppliersLoading.value) ||
    forceReload
  ) {
    suppliersLoading.value = true;
    suppliersError.value = null;

    try {
      const { data, error } = await supabase
        .from("suppliers")
        .select(`id, created_at, person:fk_person (id, display_name)`)
        .overrideTypes<SupplierWithPerson[], { merge: false }>();

      if (error) throw new Error(error.message);

      suppliers.value = data.map(({ id, created_at, person }) => ({
        id,
        created_at,
        person_name: person?.display_name || null,
      }));
    } catch (err: any) {
      suppliersError.value = `Fehler beim Laden der Lieferanten: ${err.message}`;
      console.error("Error loading suppliers:", err);
      presentToast(suppliersError.value, "danger");
    } finally {
      suppliersLoading.value = false;
    }
  }
}
