import { computed } from "vue";
import type { PaloxesNameBySlotView } from "@/types/generated/views/paloxes-name-by-slot-view";

const DEFAULT_GRID_VALUE = 1;

interface GridBounds {
  minC: number;
  maxC: number;
  minR: number;
  maxR: number;
}

export function useStockGrid(getSlots: () => PaloxesNameBySlotView[]) {
  const gridBounds = computed(() => {
    const slots = getSlots();
    if (!slots.length) {
      return {
        minC: DEFAULT_GRID_VALUE,
        maxC: DEFAULT_GRID_VALUE,
        minR: DEFAULT_GRID_VALUE,
        maxR: DEFAULT_GRID_VALUE,
      };
    }

    return slots.reduce(
      (acc: GridBounds, s: PaloxesNameBySlotView) => ({
        minC: Math.min(acc.minC, s.column ?? DEFAULT_GRID_VALUE),
        maxC: Math.max(acc.maxC, s.column ?? DEFAULT_GRID_VALUE),
        minR: Math.min(acc.minR, s.slot ?? DEFAULT_GRID_VALUE),
        maxR: Math.max(acc.maxR, s.slot ?? DEFAULT_GRID_VALUE),
      }),
      {
        minC: Infinity,
        maxC: -Infinity,
        minR: Infinity,
        maxR: -Infinity,
      },
    );
  });

  const totalColumns = computed(
    () => gridBounds.value.maxC - gridBounds.value.minC + 1,
  );
  const totalRows = computed(
    () => gridBounds.value.maxR - gridBounds.value.minR + 1,
  );

  const getGridItemStyle = (slot: PaloxesNameBySlotView) => ({
    gridColumnStart: (slot.column ?? 1) - gridBounds.value.minC + 1,
    gridRowStart: (slot.slot ?? 1) - gridBounds.value.minR + 1,
  });

  return { totalColumns, totalRows, getGridItemStyle };
}
