<template>
  <div v-if="isLoading" class="loading-container">
    <IonSpinner name="crescent" />
  </div>

  <div v-else-if="noCoordinates" class="empty-state">
    <p>Keine Koordinaten vorhanden.</p>
  </div>

  <TresCanvas v-else clear-color="#f6f6f6" @ready="onSceneReady">
    <TresPerspectiveCamera :position="cameraPosition" />
    <OrbitControls :target="orbitTarget" />

    <TresMesh :position="floorPosition">
      <TresBoxGeometry :args="floorGeometry" />
      <TresMeshBasicMaterial :color="floorColor" wireframe />
    </TresMesh>

    <Html v-if="sceneReady" :position="frontLabelPosition" center>
      <div class="scene-label">Frontansicht</div>
    </Html>

    <template v-for="coordinate in coordinates" :key="coordinate.slot_level_id">
      <CoordinateBox
        v-if="sceneReady"
        :coordinate="coordinate"
        :isActive="coordinate.slot_level_id === slotLevelId"
        :paloxDisplayName="paloxDisplayName"
      />
    </template>
  </TresCanvas>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { TresCanvas } from "@tresjs/core";
import { OrbitControls, Html } from "@tresjs/cientos";
import { IonSpinner } from "@ionic/vue";
import CoordinateBox from "./CoordinateBox.vue";
import type { Coordinate } from "@/types/schemas/coordinate-schema";
import type {
  Vector3Tuple,
  BoxArgsTuple,
  TresVector3Like,
} from "@/types/tres-types";

const props = defineProps<{
  coordinates: Coordinate[] | null;
  slotLevelId: number;
  paloxDisplayName: string;
  isLoading: boolean;
}>();

const sceneReady = ref(false);

function onSceneReady() {
  requestAnimationFrame(() => (sceneReady.value = true));
}

const noCoordinates = computed(
  () => !props.coordinates || props.coordinates.length === 0
);

const cameraPosition: Vector3Tuple = [10, 8, 10];
const orbitTarget: TresVector3Like = [1.5, 2, 2];
const floorPosition: Vector3Tuple = [1.5, -0.5, 2];
const floorGeometry: BoxArgsTuple = [4, 0.01, 5, 4, 1, 5];
const floorColor = "lightblue";
const frontLabelPosition: Vector3Tuple = [1.5, -0.5, 5];
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.empty-state {
  text-align: center;
  color: var(--ion-color-medium);
  padding: 1rem;
}

.scene-label {
  color: grey;
  font-size: 0.9rem;
}
</style>
