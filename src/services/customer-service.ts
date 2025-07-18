import { supabase } from "@/supabase";
import { ref } from "vue";
import { presentToast } from "./toast-service";
import { Tables } from "@/types/database.types";
import { CustomerListItem } from "@/types/customer-list-item";

export type CustomerRow = Tables<"customers">;
export type PersonRow = Tables<"persons">;

export type CustomerWithPerson = CustomerRow & {
  person: Pick<PersonRow, "id" | "created_at" | "display_name"> | null;
};

export const customers = ref<CustomerListItem[]>([]);
export const customersLoading = ref(false);
export const customersError = ref<string | null>(null);

/**
 * Holt Kundendaten einmalig ab.
 */
export async function loadCustomersForList(forceReload: boolean = false) {
  if (
    (customers.value.length === 0 && !customersLoading.value) ||
    forceReload
  ) {
    customersLoading.value = true;
    customersError.value = null;

    try {
      const { data, error } = await supabase
        .from("customers")
        .select(
          `
          id,
          created_at,
          fk_person,
          person:fk_person (
            id,
            created_at,
            display_name
          )
        `
        )
        .overrideTypes<CustomerWithPerson[], { merge: false }>();
      if (error) throw new Error(error.message);
      customers.value =
        data?.map(({ id, created_at, person }) => ({
          id,
          created_at,
          person: person ? { display_name: person.display_name } : null,
        })) || [];
    } catch (err: any) {
      const msg = `Fehler beim Laden der Kunden: ${err.message}`;
      customersError.value = msg;
      console.error("Error loading customers:", err);
      presentToast(msg, "danger");
    } finally {
      customersLoading.value = false;
    }
  }
}

/**
 * Reinitializes customer data.
 */
export async function reinitializeCustomerData() {
  await loadCustomersForList(true);
  console.log("Reinitialized customer data (no Realtime subscription).");
}
