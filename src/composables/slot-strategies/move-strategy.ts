import { SlotSelectionStrategy } from "@/types/slot-selection-strategy";
import { SlotContent } from "@/types/schemas/slot-content-schema";
import { StepResult } from "@/types/step-result";
import { toggleMultiSelection } from "@/utils/selection-helper";
import { createFinalStepChecker } from "@/utils/strategy-helper";
import { executeMovePaloxesToDifferentLevel } from "@/utils/db-payload-helper";

const MIN_SELECTION_REQUIRED = 2;
const FINAL_STEP = 3;

export const moveStrategy: SlotSelectionStrategy = {
  isDisabled: (_slot: SlotContent): boolean => {
    return false;
  },
  getMaxSelection: (): number => Number.MAX_SAFE_INTEGER,
  canProceed: (currentSelection: SlotContent[] | null | undefined): boolean => {
    const selection = currentSelection || [];
    if (selection.length < MIN_SELECTION_REQUIRED) {
      return false;
    }
    const hasPaloxe = selection.some((slot) => slot.current_taken_levels > 0);
    return hasPaloxe;
  },
  select: toggleMultiSelection,
  isFinalStep: createFinalStepChecker(FINAL_STEP),
  async executeFinalAction(store): Promise<StepResult> {
    return await executeMovePaloxesToDifferentLevel(store);
  },
};
