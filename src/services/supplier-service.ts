import { supabase } from "@/supabase";
import {
  SupplierList,
  SupplierListArraySchema,
} from "@/types/schemas/supplier-list-schema";

export async function fetchSuppliersWithPerson(): Promise<SupplierList[]> {
  const { data, error } = await supabase.from("suppliers").select(
    `
      id,
      created_at,
      person:fk_person (
        display_name
      )
    `
  );
  if (error) {
    throw error;
  }
  if (!data) {
    return [];
  }
  const validationResult = SupplierListArraySchema.safeParse(data);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return validationResult.data.sort((a, b) =>
    a.person.display_name.localeCompare(b.person.display_name)
  );
}
