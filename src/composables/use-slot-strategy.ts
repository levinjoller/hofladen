// src/composables/use-slot-strategy.ts
import { computed, Ref } from "vue";
import { reorderStrategy } from "./slot-strategies/reorder-strategy";
import { moveStrategy } from "./slot-strategies/move-strategy";
import { SlotSelectionStrategy } from "@/types/slot-selection-strategy";
import { Modi } from "@/types/modi";
import { insertStrategy } from "./slot-strategies/insert-strategy";

export function useSlotStrategy(modi: Ref<Modi>) {
  const strategyMap: Record<Modi, SlotSelectionStrategy> = {
    reorder: reorderStrategy,
    move: moveStrategy,
    swap: reorderStrategy,
    insert: insertStrategy,
  };
  const activeStrategy = computed<SlotSelectionStrategy>(() => {
    return strategyMap[modi.value] || reorderStrategy;
  });

  return activeStrategy;
}
