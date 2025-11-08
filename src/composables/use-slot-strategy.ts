import { computed, Ref } from "vue";
import { Modi } from "@/types/modi";
import { SlotSelectionStrategy } from "@/types/slot-selection-strategy";
import { reorderStrategy } from "./slot-strategies/reorder-strategy";
import { moveStrategy } from "./slot-strategies/move-strategy";
import { insertStrategy } from "./slot-strategies/insert-strategy";
import { swapStrategy } from "./slot-strategies/swap-strategy";

export function useSlotStrategy(modi: Ref<Modi>) {
  const strategyMap: Record<Modi, SlotSelectionStrategy> = {
    reorder: reorderStrategy,
    move: moveStrategy,
    swap: swapStrategy,
    insert: insertStrategy,
  };
  const activeStrategy = computed<SlotSelectionStrategy>(() => {
    return strategyMap[modi.value] || reorderStrategy;
  });

  return activeStrategy;
}
