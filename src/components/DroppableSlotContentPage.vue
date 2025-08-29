<template>
  <div v-if="isLoading" class="ion-padding ion-text-center">
    <ion-spinner name="crescent" />
  </div>
  <div v-else-if="data.length > 0">
    <h2>Paloxenreihenfolge ändern</h2>
    <div class="container">
      <div
        v-for="slotData in data"
        :key="slotData.slot_id"
        class="list-wrapper"
      >
        <h3>{{ slotData.slot_display_name }}</h3>
        <VueDraggable
          :options="{ scroll: true }"
          class="draggable-list"
          v-model="slotData.levels"
          group="changedSlots"
        >
          <DraggableItem
            v-for="level in slotData.levels"
            :key="level.palox_id"
            :level="level"
          />
        </VueDraggable>
      </div>
    </div>
  </div>
  <ion-text v-else-if="data.length === 0" class="ion-padding">
    Keine Daten verfügbar.
  </ion-text>
</template>

<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus";
import { IonSpinner, IonText } from "@ionic/vue";
import DraggableItem from "@/components/DraggableItem.vue";
import { fetchPaloxesNameBySlot } from "@/services/palox-create-service";
import { useDbFetch } from "@/composables/use-db-action";
import { SlotContent } from "@/types/schemas/slot-content-schema";

const props = defineProps<{
  slot: SlotContent;
}>();

const { data, isLoading, execute } = useDbFetch(fetchPaloxesNameBySlot);
execute(props.slot.slot_id);
</script>

<style scoped>
.container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.draggable-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 200px;
  background: var(--ion-color-step-100);
  border-radius: 8px;
  overflow: auto;
  min-height: 100px;
  padding: 1rem;
  border: 2px dashed var(--ion-color-medium);
}
.sortable-drag .list-item {
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
  transition: transform 0.2s ease-in-out;
}

.sortable-ghost .list-item {
  opacity: 0.5;
  background-color: var(--ion-color-step-150);
}

.placeholder-text {
  text-align: center;
  color: var(--ion-color-medium);
  padding: 1rem;
}
</style>
