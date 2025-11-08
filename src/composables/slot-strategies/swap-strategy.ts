import { SlotContent } from "@/types/schemas/slot-content-schema";
import { SlotSelectionStrategy } from "@/types/slot-selection-strategy";
import { useDbAction } from "../use-db-action";
import { swapPaloxesBetweenSlots } from "@/services/palox-service";
import type { StepResult } from "@/types/step-result";
import {
  createFinalStepChecker,
  FAILED_PRECHECK_RESULT,
  hasExactSelectionCount,
} from "@/utils/strategy-helper";
import { toggleSwapSelection } from "@/utils/selection-helper";
import { createTwoSlotPayload } from "@/utils/db-payload-helper";

const MAX_SELECTION = 2;
const FINAL_STEP = 2;

export const swapStrategy: SlotSelectionStrategy = {
  isDisabled: (_slot: SlotContent): boolean => {
    return false;
  },
  getMaxSelection: (): number => MAX_SELECTION,
  canProceed: (currentSelection: SlotContent[] | null | undefined): boolean => {
    return hasExactSelectionCount(currentSelection, MAX_SELECTION);
  },
  select: (
    slot: SlotContent,
    currentSelection: SlotContent[] | null | undefined
  ): SlotContent[] | null => {
    return toggleSwapSelection(slot, currentSelection, MAX_SELECTION);
  },
  isFinalStep: createFinalStepChecker(FINAL_STEP),
  async executeFinalAction(store): Promise<StepResult> {
    const { execute } = useDbAction(swapPaloxesBetweenSlots, (loading, error) =>
      store.setStrategyActionStatus(loading, error)
    );
    const selected = store.selectedStockColumnSlot;
    if (selected.length !== MAX_SELECTION) {
      return FAILED_PRECHECK_RESULT;
    }
    const payload = createTwoSlotPayload(selected);
    await execute(payload);
    const success = !store.actionErrorMessage;
    return {
      success,
      parentReloadRequired: success,
      closeModal: success,
      isCompleted: true,
    };
  },
};
