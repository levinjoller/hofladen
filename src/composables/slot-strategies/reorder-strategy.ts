import { SlotContent } from "@/types/schemas/slot-content-schema";
import { SlotSelectionStrategy } from "@/types/slot-selection-strategy";
import { StepResult } from "@/types/step-result";
import { executeMovePaloxesToDifferentLevel } from "@/utils/db-payload-helper";
import { toggleSingleSelection } from "@/utils/selection-helper";
import {
  createFinalStepChecker,
  isSelectionBetweenOneToMax,
} from "@/utils/strategy-helper";

const MAX_SELECTION = 1;
const FINAL_STEP = 3;

export const reorderStrategy: SlotSelectionStrategy = {
  isDisabled: (slot: SlotContent): boolean => {
    return slot.current_taken_levels < 2;
  },
  getMaxSelection: (): number => MAX_SELECTION,
  canProceed: (currentSelection: SlotContent[] | null | undefined): boolean => {
    return isSelectionBetweenOneToMax(currentSelection, MAX_SELECTION);
  },
  select: toggleSingleSelection,
  isFinalStep: createFinalStepChecker(FINAL_STEP),
  async executeFinalAction(store): Promise<StepResult> {
    return await executeMovePaloxesToDifferentLevel(store);
  },
};
