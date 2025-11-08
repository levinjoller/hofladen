import { SlotContent } from "@/types/schemas/slot-content-schema";
import { StepResult } from "@/types/step-result";

export const FAILED_PRECHECK_RESULT: StepResult = {
  success: false,
  parentReloadRequired: false,
  closeModal: false,
  isCompleted: false,
};

export const arraysEqual = (a: number[], b: number[]): boolean => {
  return a.length === b.length && a.every((val, i) => val === b[i]);
};

export const isSelectionBetweenOneToMax = (
  currentSelection: SlotContent[] | null | undefined,
  maxSelection: number
): boolean => {
  const selection = currentSelection || [];
  return selection.length > 0 && selection.length <= maxSelection;
};

export const hasExactSelectionCount = (
  currentSelection: SlotContent[] | null | undefined,
  requiredCount: number
): boolean => {
  return (currentSelection?.length ?? 0) === requiredCount;
};

export const createFinalStepChecker = (finalStep: number) => {
  return (currentStep: number): boolean => currentStep === finalStep;
};
