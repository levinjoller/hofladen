// src/types/stores/palox-store.ts
import type { DropdownSearchItem } from "@/types/dropdown-search-item";
import type { SlotContent } from "@/types/schemas/slot-content-schema";

export interface PaloxStoreState {
  currentStep: number;

  selectedPalox: DropdownSearchItem | null;
  selectedSupplier: DropdownSearchItem | null;
  selectedCustomer: DropdownSearchItem | null;
  selectedProduct: DropdownSearchItem | null;
  selectedStock: DropdownSearchItem | null;
  _selectedPaloxType: DropdownSearchItem | null;
  selectedStockColumnSlot: SlotContent | null;
}
