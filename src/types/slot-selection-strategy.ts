import { useSlotReorderStore } from "@/stores/slot-reorder-store";
import { SlotContent } from "@/types/schemas/slot-content-schema";
import { StepResult } from "./step-result";

export type SlotReorderStoreInstance = ReturnType<typeof useSlotReorderStore>;

export interface SlotSelectionStrategy<TPayload = unknown> {
  isDisabled(slot: SlotContent): boolean;
  getMaxSelection(): number;
  canProceed(currentSelection: SlotContent[] | null | undefined): boolean;
  select(
    slot: SlotContent,
    currentSelection: SlotContent[] | null | undefined
  ): SlotContent[] | null;
  isFinalStep(currentStep: number): boolean;
  executeFinalAction?(
    store: SlotReorderStoreInstance,
    payload?: TPayload
  ): Promise<StepResult>;
}
