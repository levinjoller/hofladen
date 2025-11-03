import { DropdownSearchItem } from "@/types/dropdown-search-item";
import { SlotPaloxOrderData } from "../slot-palox-order-data";
import { SlotSelectionStrategy } from "../slot-selection-strategy";
import { SlotContent } from "../schemas/slot-content-schema";

export interface SlotReorderState {
  currentStep: number;
  selectedStrategy: SlotSelectionStrategy | null;
  selectedStock: DropdownSearchItem | null;
  selectedStockColumnSlot: SlotContent[];
  originalOrder: SlotPaloxOrderData[];
  newOrder: SlotPaloxOrderData[];
}
