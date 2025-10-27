<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title
          >Lagerplatz: {{ stockLocationDisplayName }}; Paloxe:
          {{ paloxDisplayName }}</ion-title
        >
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" scroll="false">
      <div id="canvas-wrapper">
        <MatrixGridAsync
          :coordinates="data"
          :slotLevelId="slotLevelId"
          :paloxDisplayName="paloxDisplayName"
          :isLoading="isLoading"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { closeOutline } from "ionicons/icons";
import {
  IonButtons,
  modalController,
  IonToolbar,
  IonPage,
  IonButton,
  IonIcon,
  IonTitle,
  IonHeader,
  IonContent,
} from "@ionic/vue";
import { Coordinate } from "@/types/schemas/coordinate-schema";
import { defineAsyncComponent, onMounted } from "vue";
import { useDbFetch } from "@/composables/use-db-action";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const MatrixGridAsync = defineAsyncComponent({
  loader: () => import("@/components/MatrixGrid.vue"),
  loadingComponent: LoadingSpinner,
  delay: 200,
});

const props = defineProps<{
  stockId: number;
  slotLevelId: number;
  stockLocationDisplayName: string;
  paloxDisplayName: string;
  fetchMethod: (...args: any[]) => Promise<Coordinate[]>;
}>();

const { data, isLoading, execute } = useDbFetch(props.fetchMethod);

onMounted(async () => {
  await execute({ stockId: props.stockId });
});

function closeModal() {
  modalController.dismiss();
}
</script>
<style scoped>
#canvas-wrapper {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 1;
}
#canvas-wrapper > .tres-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
