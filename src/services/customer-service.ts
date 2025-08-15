import { supabase } from "@/supabase";
import {
  CustomerList,
  CustomerListArraySchema,
} from "@/types/schemas/customer-list-schema";

export async function fetchCustomersWithPerson(): Promise<CustomerList[]> {
  const { data, error } = await supabase.from("customers").select(
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
  const validationResult = CustomerListArraySchema.safeParse(data);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return validationResult.data.sort((a, b) =>
    a.person.display_name.localeCompare(b.person.display_name)
  );
}
