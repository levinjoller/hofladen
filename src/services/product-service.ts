import { supabase } from "@/supabase";
import {
  ProductList,
  ProductListArraySchema,
} from "@/types/schemas/product-list-schema";

export async function fetchProducts(): Promise<ProductList[]> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id, 
      display_name,
      created_at,
      type:fk_product_type (
        display_name,  
        emoji
      )
      `
    )
    .order("display_name", { ascending: true });
  if (error) {
    throw error;
  }
  if (!data) {
    return [];
  }
  const validationResult = ProductListArraySchema.safeParse(data);
  if (!validationResult.success) {
    throw validationResult.error;
  }
  return validationResult.data;
}
