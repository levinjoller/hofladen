import { SlotContent } from "@/types/schemas/slot-content-schema";
import { SlotSelectionStrategy } from "@/types/slot-selection-strategy";

const MAX_SELECTIONS_FOR_REORDER = 1;

export const reorderStrategy: SlotSelectionStrategy = {
  isDisabled: (slot: SlotContent): boolean => {
    return slot.current_taken_levels < 2;
  },
  getMaxSelection: (): number => {
    return MAX_SELECTIONS_FOR_REORDER;
  },
  canProceed: (currentSelection: SlotContent[] | null | undefined): boolean => {
    const selection = currentSelection || [];
    return (
      selection.length > 0 && selection.length <= MAX_SELECTIONS_FOR_REORDER
    );
  },
  select: (
    slot: SlotContent,
    _currentSelection: SlotContent[] | null | undefined
  ): SlotContent[] | null => {
    return [slot];
  },
};
