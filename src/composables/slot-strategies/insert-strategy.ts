import { SlotContent } from "@/types/schemas/slot-content-schema";
import { SlotSelectionStrategy } from "@/types/slot-selection-strategy";
import { toggleSingleSelection } from "@/utils/selection-helper";
import {
  createFinalStepChecker,
  isSelectionBetweenOneToMax,
} from "@/utils/strategy-helper";

const MAX_SELECTION = 1;
const FINAL_STEP = 3;

export const insertStrategy: SlotSelectionStrategy = {
  isDisabled: (slot: SlotContent): boolean => {
    return slot.is_full;
  },
  getMaxSelection: (): number => {
    return MAX_SELECTION;
  },
  canProceed: (currentSelection: SlotContent[] | null | undefined): boolean => {
    return isSelectionBetweenOneToMax(currentSelection, MAX_SELECTION);
  },
  select: toggleSingleSelection,
  isFinalStep: createFinalStepChecker(FINAL_STEP),
};
