import { ref, watchEffect } from "vue";
import type { PaloxesNameBySlotView } from "@/types/generated/views/paloxes-name-by-slot-view";
import type { SlotPaloxOrderData } from "@/types/slot-palox-order-data";

export function useStockSlots(
  source: () => PaloxesNameBySlotView[] | null | undefined,
  emitInitial: (p: SlotPaloxOrderData) => void,
  emitChanged: (p: SlotPaloxOrderData) => void,
) {
  const slots = ref<PaloxesNameBySlotView[]>([]);

  watchEffect(() => {
    const data = source();
    if (!data) return;
    const processed = data.map((slot) => {
      const levels = [...slot.levels].reverse();
      emitInitial({
        slotId: slot.slot_id,
        paloxIds: [...levels].reverse().map((l) => l.palox_id),
      });
      return { ...slot, levels };
    });
    slots.value = processed;
  });

  function updateSlot(slot: PaloxesNameBySlotView) {
    emitChanged({
      slotId: slot.slot_id,
      paloxIds: [...slot.levels].reverse().map((l) => l.palox_id),
    });
  }

  return { slots, updateSlot };
}
