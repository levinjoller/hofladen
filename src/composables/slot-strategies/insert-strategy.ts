import { SlotContent } from "@/types/schemas/slot-content-schema";
import { SlotSelectionStrategy } from "@/types/slot-selection-strategy";

const MAX_SELECTIONS_FOR_INSERT = 1;

export const insertStrategy: SlotSelectionStrategy = {
  isDisabled: (slot: SlotContent): boolean => {
    return slot.is_full;
  },
  getMaxSelection: (): number => {
    return MAX_SELECTIONS_FOR_INSERT;
  },
  canProceed: (currentSelection: SlotContent[] | null | undefined): boolean => {
    const selection = currentSelection || [];
    return (
      selection.length > 0 && selection.length <= MAX_SELECTIONS_FOR_INSERT
    );
  },
  select: (
    slot: SlotContent,
    currentSelection: SlotContent[] | null | undefined
  ): SlotContent[] | null => {
    const isSelected = currentSelection?.some(
      (s) => s.slot_id === slot.slot_id
    );
    if (isSelected) {
      return null;
    } else {
      return [slot];
    }
  },
};
