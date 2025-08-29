<template>
  <ion-item class="list-item">
    <ion-label>
      {{ level.display_name }}
    </ion-label>
  </ion-item>
</template>

<script setup lang="ts">
import { IonItem, IonLabel } from "@ionic/vue";
import { LevelContent } from "@/types/schemas/level-content-schema";

defineProps<{
  level: LevelContent;
}>();
</script>

<style scoped>
.list-item {
  --inner-padding-top: 0px;
  --inner-padding-bottom: 0px;
  --min-height: 0;
  cursor: grab;
}
</style>
