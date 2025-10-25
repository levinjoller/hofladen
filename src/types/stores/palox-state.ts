import type { DropdownSearchItem } from "@/types/dropdown-search-item";
import type { SlotContent } from "@/types/schemas/slot-content-schema";

export interface PaloxStoreState {
  currentStep: number;

  selectedPaloxType: DropdownSearchItem | null;
  selectedPaloxNumber: number | null;
  selectedSupplier: DropdownSearchItem | null;
  selectedCustomer: DropdownSearchItem | null;
  selectedProduct: DropdownSearchItem | null;
  selectedStock: DropdownSearchItem | null;
  selectedStockColumnSlot: SlotContent | null;
}
