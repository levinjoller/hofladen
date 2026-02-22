<template>
  <div class="list-wrapper">
    <h3>{{ slotData.slot_display_name }}</h3>

    <VueDraggable
      v-model="slotData.levels"
      class="draggable-list"
      :animation="150"
      :scroll="true"
      :scroll-sensitivity="100"
      :scroll-speed="10"
      :force-fallback="true"
      :fallback-on-body="true"
      ghostClass="ghost"
      group="changedSlots"
      @update="emitChange"
      @add="emitChange"
      @remove="emitChange"
    >
      <DraggableItem
        v-for="level in slotData.levels"
        :key="level.palox_id"
        :level="level"
      />
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus";
import DraggableItem from "@/components/DraggableItem.vue";
import type { PaloxesNameBySlotView } from "@/types/generated/views/paloxes-name-by-slot-view";

const props = defineProps<{
  slotData: PaloxesNameBySlotView;
}>();

const emit = defineEmits<{
  (e: "slot-change", slotData: PaloxesNameBySlotView): void;
}>();

function emitChange() {
  emit("slot-change", props.slotData);
}
</script>

<style lang="css" scoped>
.list-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.draggable-list {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.5rem;
  width: 200px;
  background: var(--ion-color-step-100);
  border-radius: 8px;
  overflow: auto;
  min-height: 100px;
  padding: 1rem;
  border: 2px dashed var(--ion-color-medium);
}
</style>
