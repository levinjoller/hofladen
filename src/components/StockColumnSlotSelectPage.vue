<template>
  <div class="stock-column-slot-select-page">
    <div v-if="isLoading" class="ion-padding ion-text-center">
      <ion-spinner name="crescent" />
    </div>
    <div v-else-if="hasNoData" class="ion-padding">
      <p class="ion-text-center">
        Keine Lagerplätze in diesem Lager verfügbar.
      </p>
    </div>
    <div v-else-if="shouldShowContent">
      <h2 class="ion-text-center ion-padding-bottom">
        Lager <strong>{{ selectedStock?.display_name }}</strong>
        <br />
        <small>
          Ausgewählt: <strong>{{ modelValue?.length ?? 0 }}</strong> /
          <strong>{{ maxSelectionDisplay }}</strong>
        </small>
      </h2>
      <ion-grid>
        <ion-row>
          <ion-col
            v-for="column in data"
            :key="column.column_number"
            class="ion-text-center"
          >
            <div v-for="slot in column.slots" :key="slot.slot_id">
              <ion-card
                :class="{ 'slot-disabled': isDisabled(slot) }"
                :color="isSelected(slot) ? 'primary' : ''"
                :disabled="isDisabled(slot)"
                @click="select(slot)"
              >
                <ion-card-content>
                  <div>{{ slot.display_name }}</div>

                  <div
                    v-if="slot.free_levels !== null"
                    :class="['free-levels', slot.is_full ? 'full' : 'free']"
                  >
                    <span class="dot"></span>
                    <span>{{ slot.free_levels }}</span>
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
import { computed, watch } from "vue";
import { fetchStockColumnSlotsByColumn } from "@/services/palox-create-service";
import { useDbFetch } from "@/composables/use-db-action";
import { presentToast } from "@/services/toast-service";
import type { DropdownSearchItem } from "@/types/dropdown-search-item";
import type { SlotContent } from "@/types/schemas/slot-content-schema";
import type { SlotSelectionStrategy } from "@/types/slot-selection-strategy";
import { StockColumnSlotsByColumnView } from "@/types/generated/views/stock-column-slots-by-column-view";

const props = defineProps<{
  modelValue: SlotContent[] | null;
  selectedStock: DropdownSearchItem;
  activeStrategy: SlotSelectionStrategy;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", val: SlotContent[] | null): void;
}>();

const { data, isLoading, errorMessage, execute } = useDbFetch<
  StockColumnSlotsByColumnView,
  typeof fetchStockColumnSlotsByColumn
>(fetchStockColumnSlotsByColumn);

watch(
  () => props.selectedStock.id,
  async (newStockId) => {
    if (newStockId) {
      await execute(newStockId);
    }
  },
  { immediate: true }
);

watch(errorMessage, (newError) => {
  if (newError) {
    presentToast(newError, "danger", 6000);
  }
});

const maxSelectionDisplay = computed(() => {
  const maxVal = props.activeStrategy.getMaxSelection();
  if (maxVal === Number.MAX_SAFE_INTEGER) {
    return "unbegrenzt";
  }
  return maxVal;
});

const shouldShowContent = computed(
  () => !isLoading.value && data.value && data.value.length > 0
);
const hasNoData = computed(
  () => !isLoading.value && (!data.value || data.value.length === 0)
);

const isSelected = (slot: SlotContent) =>
  props.modelValue?.some((s) => s.slot_id === slot.slot_id) ?? false;

const isDisabled = (slot: SlotContent): boolean => {
  return props.activeStrategy.isDisabled(slot);
};

const select = (slot: SlotContent) => {
  if (isDisabled(slot)) return;
  const newSelection = props.activeStrategy.select(slot, props.modelValue);
  emit("update:modelValue", newSelection);
};
</script>

<style scoped>
ion-card {
  cursor: pointer;
  transition: transform 0.1s, opacity 0.3s;
  margin: 8px;
}

ion-card:hover:not(.slot-disabled) {
  transform: scale(1.05);
}

.slot-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

ion-card-content {
  font-weight: 600;
  font-size: 1rem;
  padding: 10px;
}

.free-levels {
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: normal;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}

.free-levels.free .dot {
  background-color: var(--ion-color-success, #2dd36f);
}

.free-levels.full .dot {
  background-color: var(--ion-color-danger, #eb445a);
}
</style>
