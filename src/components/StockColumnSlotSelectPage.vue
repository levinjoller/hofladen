<template>
  <div>
    <div v-if="isLoading" class="ion-padding ion-text-center">
      <ion-spinner name="crescent" />
    </div>

    <div v-else-if="slots.length > 0">
      <h2>Lager {{ selectedStock?.display_name }} - Lagerplatz wählen</h2>
      <ion-grid>
        <ion-row>
          <ion-col
            v-for="group in slots"
            :key="group.column_number"
            class="ion-text-center"
          >
            <div v-for="slot in group.slot" :key="slot.slot_id">
              <ion-card
                :color="modelValue?.slot_id === slot.slot_id ? 'primary' : ''"
                :disabled="slot.is_full"
                @click="!slot.is_full && select(slot)"
              >
                <ion-card-content>
                  <div>{{ slot.display_name }}</div>
                  <div
                    v-if="slot.free_levels !== null"
                    :class="['free-levels', slot.is_full ? 'full' : 'free']"
                  >
                    <span class="dot"></span>
                    {{ slot.free_levels }}
                  </div>
                </ion-card-content>
              </ion-card>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonSpinner,
} from "@ionic/vue";
import { watch, computed } from "vue";
import { fetchStockColumnSlots } from "@/services/palox-create-service";
import { useDbAction } from "@/composables/use-db-action";
import type { CardGridSlot } from "@/types/card-grid-slot";
import type { DropdownSearchItem } from "@/types/dropdown-search-item";
import { presentToast } from "@/services/toast-service";
import { StockColumnSlotViewModel } from "@/types/stock-column-slot-view-model";

const props = defineProps<{
  modelValue: StockColumnSlotViewModel | null;
  selectedStock: DropdownSearchItem | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", val: StockColumnSlotViewModel | null): void;
}>();

const { data, isLoading, error, execute } = useDbAction(fetchStockColumnSlots);

watch(
  () => props.selectedStock,
  async (newStock) => {
    if (newStock?.id) {
      await execute(newStock.id);
    }
  },
  { immediate: true }
);

watch(error, (newError) => {
  if (newError) {
    presentToast(newError.message, "danger", 6000);
  }
});

const slots = computed<CardGridSlot[]>(() => {
  if (!data.value) return [];
  const groups = new Map<number, CardGridSlot>();
  for (const slot of data.value) {
    const col = slot.column_number;
    if (!groups.has(col)) {
      groups.set(col, { column_number: col, slot: [] });
    }
    groups.get(col)!.slot.push(slot);
  }
  return Array.from(groups.values());
});

const select = (slot: StockColumnSlotViewModel) => {
  if (slot === props.modelValue) {
    emit("update:modelValue", null);
  } else {
    emit("update:modelValue", slot);
  }
};
</script>

<style scoped>
ion-card {
  cursor: pointer;
  transition: transform 0.1s;
}
ion-card:hover {
  transform: scale(1.01);
}
ion-card-content {
  font-weight: 600;
  font-size: 1rem;
}
.free-levels {
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.free-levels.free .dot {
  background-color: #0f0;
}
.free-levels.full .dot {
  background-color: #f00;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}
</style>
