import { computed } from "vue";
import type { PaloxesNameBySlotView } from "@/types/generated/views/paloxes-name-by-slot-view";

const DEFAULT_GRID_VALUE = 1;

export function useStockGrid(getSlots: () => PaloxesNameBySlotView[]) {
  const gridMetadata = computed(() => {
    const slots = getSlots();
    const uniqueCols = new Set<number>();
    const uniqueRows = new Set<number>();

    for (const s of slots) {
      uniqueCols.add(s.column ?? DEFAULT_GRID_VALUE);
      uniqueRows.add(s.slot ?? DEFAULT_GRID_VALUE);
    }

    const sortedCols = [...uniqueCols].sort((a, b) => a - b);
    const sortedRows = [...uniqueRows].sort((a, b) => a - b);

    return {
      columnMap: new Map(sortedCols.map((col, idx) => [col, idx + 1])),
      rowMap: new Map(sortedRows.map((row, idx) => [row, idx + 1])),
      totalColumns: sortedCols.length,
      totalRows: sortedRows.length,
    };
  });

  const getGridItemStyle = (slot: PaloxesNameBySlotView) => {
    const { columnMap, rowMap } = gridMetadata.value;
    return {
      gridColumnStart: columnMap.get(slot.column ?? DEFAULT_GRID_VALUE) ?? 1,
      gridRowStart: rowMap.get(slot.slot ?? DEFAULT_GRID_VALUE) ?? 1,
    };
  };

  return {
    totalColumns: computed(() => gridMetadata.value.totalColumns),
    totalRows: computed(() => gridMetadata.value.totalRows),
    getGridItemStyle,
  };
}
