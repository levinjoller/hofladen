import { SlotContent } from "@/types/schemas/slot-content-schema";

export function initializeSelection(
  currentSelection: SlotContent[] | null | undefined
): SlotContent[] {
  return [...(currentSelection || [])];
}

export function findSlotIndex(
  selection: SlotContent[],
  slot: SlotContent
): number {
  return selection.findIndex((s) => s.slot_id === slot.slot_id);
}

export function areBothSlotsEmpty(
  selection: SlotContent[],
  newSlot: SlotContent
): boolean {
  return (
    selection.length === 1 &&
    selection[0].current_taken_levels === 0 &&
    newSlot.current_taken_levels === 0
  );
}

export const setSelectionToNullIfEmpty = (
  selection: SlotContent[]
): SlotContent[] | null => {
  return selection.length > 0 ? selection : null;
};

export const toggleSingleSelection = (
  slot: SlotContent,
  currentSelection: SlotContent[] | null | undefined
): SlotContent[] | null => {
  const isSelected = currentSelection?.some((s) => s.slot_id === slot.slot_id);
  if (isSelected) {
    return null;
  }
  return [slot];
};

export const toggleMultiSelection = (
  slot: SlotContent,
  currentSelection: SlotContent[] | null | undefined
): SlotContent[] | null => {
  let newSelection = initializeSelection(currentSelection);
  const index = findSlotIndex(newSelection, slot);
  if (index !== -1) {
    newSelection.splice(index, 1);
    return setSelectionToNullIfEmpty(newSelection);
  }
  newSelection.push(slot);
  return newSelection;
};

export const toggleSwapSelection = (
  slot: SlotContent,
  currentSelection: SlotContent[] | null | undefined,
  maxSelection: number
): SlotContent[] | null => {
  let newSelection = initializeSelection(currentSelection);
  const index = findSlotIndex(newSelection, slot);
  if (index !== -1) {
    newSelection.splice(index, 1);
    return setSelectionToNullIfEmpty(newSelection);
  }
  if (areBothSlotsEmpty(newSelection, slot)) {
    return newSelection;
  }
  if (newSelection.length < maxSelection) {
    newSelection.push(slot);
    return newSelection;
  }
  return newSelection;
};
