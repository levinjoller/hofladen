import { supabase } from "@/supabase";
import { Product, ProductArraySchema } from "@/types/generated/tables/products";

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id, created_at, display_name")
    .order("display_name", { ascending: true });
  if (error) {
    throw error;
  }
  if (!data) {
    return [];
  }
  const validationResult = ProductArraySchema.safeParse(data);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return validationResult.data;
}
