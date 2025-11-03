// src/composables/slot-strategies/move-strategy.ts
import { SlotSelectionStrategy } from "@/types/slot-selection-strategy";
import { SlotContent } from "@/types/schemas/slot-content-schema";

const MIN_SELECTIONS_FOR_REORDER = 2;

export const moveStrategy: SlotSelectionStrategy = {
  isDisabled: (_slot: SlotContent): boolean => {
    return false;
  },
  getMaxSelection: (): number => Number.MAX_SAFE_INTEGER,
  canProceed: (currentSelection: SlotContent[] | null | undefined): boolean => {
    const selection = currentSelection || [];
    if (selection.length < MIN_SELECTIONS_FOR_REORDER) {
      return false;
    }
    const hasPaloxe = selection.some((slot) => slot.current_taken_levels > 0);
    return hasPaloxe;
  },
  select: (
    slot: SlotContent,
    currentSelection: SlotContent[] | null | undefined
  ): SlotContent[] | null => {
    let newSelection = [...(currentSelection || [])];
    const index = newSelection.findIndex((s) => s.slot_id === slot.slot_id);
    if (index !== -1) {
      newSelection.splice(index, 1);
      return newSelection.length > 0 ? newSelection : null;
    }
    newSelection.push(slot);
    return newSelection;
  },
};
