import { SlotContent } from "@/types/schemas/slot-content-schema";

export interface SlotSelectionStrategy {
  isDisabled(slot: SlotContent): boolean;
  getMaxSelection(): number;
  canProceed(currentSelection: SlotContent[] | null | undefined): boolean;
  select(
    slot: SlotContent,
    currentSelection: SlotContent[] | null | undefined
  ): SlotContent[] | null;
}
