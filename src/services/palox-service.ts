import { supabase } from "@/supabase";
import {
  PaloxesInStockView,
  PaloxesInStockViewArraySchema,
} from "@/types/generated/paloxes-in-stock-view";

export async function fetchPaloxesInStock(): Promise<PaloxesInStockView[]> {
  const { data, error } = await supabase
    .from("paloxes_in_stock_view")
    .select()
    .order("palox_display_name", { ascending: true });
  if (error) {
    throw new Error(`Fehler beim Laden des Lagerinhalts: ${error.message}`);
  }
  if (!data) {
    return [];
  }
  const validationResult = PaloxesInStockViewArraySchema.safeParse(data);
  if (!validationResult.success) {
    const zodErrorMessage = createZodErrorMessage(
      validationResult.error.issues
    );
    throw new Error(
      `Die Daten des Lagerinhalts entsprechen nicht dem erwarteten Format: ${zodErrorMessage}`
    );
  }
  return validationResult.data;
}

function createZodErrorMessage(issues: any[]): string {
  return issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join(", ");
}
