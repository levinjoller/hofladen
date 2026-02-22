<template>
  <div v-if="isLoading" class="ion-padding ion-text-center">
    <ion-spinner name="crescent" />
  </div>

  <div v-else-if="slots.length" class="stock-fixed-viewport">
    <h2 class="header-fix">
      Lager {{ selectedStock.display_name }} - Zuordnung ändern
    </h2>

    <div class="stock-scroll-area">
      <div
        class="stock-grid"
        :style="{ '--cols': totalColumns, '--rows': totalRows }"
      >
        <SlotDraggableAsync
          v-for="slotData in slots"
          :key="slotData.slot_id"
          :slotData="slotData"
          :style="getGridItemStyle(slotData)"
          @slot-change="updateSlot"
        />
      </div>
    </div>
  </div>

  <ion-text v-else class="ion-padding">Keine Daten verfügbar.</ion-text>
</template>

<script setup lang="ts">
import { onMounted, defineAsyncComponent } from "vue";
import { IonSpinner, IonText } from "@ionic/vue";
import { useDbFetch } from "@/composables/use-db-action";
import { fetchPaloxesNameBySlot } from "@/services/palox-create-service";
import { useStockSlots } from "@/composables/use-stock-slots";
import { useStockGrid } from "@/composables/use-stock-grid";
import type { SlotContent } from "@/types/schemas/slot-content-schema";
import type { DropdownSearchItem } from "@/types/dropdown-search-item";
import type { PaloxesNameBySlotView } from "@/types/generated/views/paloxes-name-by-slot-view";
import type { SlotPaloxOrderData } from "@/types/slot-palox-order-data";
import LoadingSpinner from "./LoadingSpinner.vue";

const SlotDraggableAsync = defineAsyncComponent({
  loader: () => import("@/components/SlotDraggable.vue"),
  loadingComponent: LoadingSpinner,
  delay: 200,
});

const props = defineProps<{
  slot: SlotContent[];
  selectedStock: DropdownSearchItem;
}>();

const emit = defineEmits<{
  (e: "initial-order", payload: SlotPaloxOrderData): void;
  (e: "changed-order", payload: SlotPaloxOrderData): void;
}>();

const { data, isLoading, execute } = useDbFetch<
  PaloxesNameBySlotView,
  typeof fetchPaloxesNameBySlot
>(fetchPaloxesNameBySlot);

onMounted(async () => {
  const slotIds = props.slot.map((s) => s.slot_id).filter(Boolean);
  if (slotIds.length) await execute(slotIds);
});

function emitInitialOrder(payload: SlotPaloxOrderData) {
  emit("initial-order", payload);
}

function emitChangedOrder(payload: SlotPaloxOrderData) {
  emit("changed-order", payload);
}

const { slots, updateSlot } = useStockSlots(
  () => data.value,
  emitInitialOrder,
  emitChangedOrder,
);

const { totalColumns, totalRows, getGridItemStyle } = useStockGrid(
  () => slots.value,
);
</script>

<style scoped>
.stock-fixed-viewport {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.header-fix {
  flex-shrink: 0;
  padding: 1rem;
  z-index: 20;
  margin: 0;
}

.stock-scroll-area {
  flex-grow: 1;
  overflow: auto;
  position: relative;
  width: 100%;
  -webkit-overflow-scrolling: touch;
}

.stock-grid {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(160px, 1fr));
  grid-template-rows: repeat(var(--rows), auto);
  gap: 2rem;
  padding: 2rem;
  width: max-content;
  min-height: 100%;
}
</style>
