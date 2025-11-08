<template>
  <div v-if="isLoading" class="ion-padding ion-text-center">
    <ion-spinner name="crescent" />
  </div>

  <div v-else-if="localData.length">
    <h2>Lager {{ selectedStock.display_name }} - Zuordnung ändern</h2>
    <div class="container">
      <SlotDraggableAsync
        v-for="slotData in localData"
        :key="slotData.slot_id"
        :slotData="slotData"
        @slot-change="handleSlotChange"
      />
    </div>
  </div>

  <ion-text v-else class="ion-padding">Keine Daten verfügbar.</ion-text>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineAsyncComponent } from "vue";
import { IonSpinner, IonText } from "@ionic/vue";
import { useDbFetch } from "@/composables/use-db-action";
import { fetchPaloxesNameBySlot } from "@/services/palox-create-service";
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

const { data, isLoading, execute } = useDbFetch<PaloxesNameBySlotView>(
  fetchPaloxesNameBySlot
);
const localData = ref<PaloxesNameBySlotView[]>([]);

onMounted(async () => {
  const slotIds = props.slot.map((s) => s.slot_id).filter(Boolean);
  if (!slotIds.length) return;
  await execute(slotIds);
});

watch(data, (newData) => {
  if (!newData) return;
  const processedData = newData.map((slot) => ({
    ...slot,
    levels: [...slot.levels].reverse(),
  })) as PaloxesNameBySlotView[];
  processedData.forEach((slot) => emitSlotChange(slot, "initial-order"));
  localData.value = processedData;
});

function emitSlotChange(
  slotData: PaloxesNameBySlotView,
  event: "initial-order" | "changed-order"
) {
  const slotId = slotData.slot_id;
  const paloxIds = [...slotData.levels].reverse().map((l) => l.palox_id);
  if (event === "initial-order") {
    emit("initial-order", { slotId, paloxIds });
  } else {
    emit("changed-order", { slotId, paloxIds });
  }
}

function handleSlotChange(slotData: PaloxesNameBySlotView) {
  emitSlotChange(slotData, "changed-order");
}
</script>

<style scoped>
.container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>
