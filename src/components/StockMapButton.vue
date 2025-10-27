<template>
  <ion-button size="small" @click="openModal">
    <ion-icon slot="icon-only" :icon="locationOutline" />
  </ion-button>
</template>

<script setup lang="ts">
import { PaloxesInStockView } from "@/types/generated/views/paloxes-in-stock-view";
import { IonButton, modalController, IonIcon } from "@ionic/vue";
import { defineAsyncComponent } from "vue";
import { locationOutline } from "ionicons/icons";
import { fetchTakenLevelCoordinates } from "@/services/palox-service";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const StockMapModalAsync = defineAsyncComponent({
  loader: () => import("@/components/StockMapModal.vue"),
  loadingComponent: LoadingSpinner,
  delay: 200,
});

const props = defineProps<{
  params: {
    data: PaloxesInStockView;
  };
}>();

const openModal = async () => {
  const modal = await modalController.create({
    component: StockMapModalAsync,
    componentProps: {
      stockId: props.params.data.stock_id,
      slotLevelId: props.params.data.slot_level_id,
      stockLocationDisplayName: props.params.data.stock_location_display_name,
      paloxDisplayName: props.params.data.palox_display_name,
      fetchMethod: fetchTakenLevelCoordinates,
    },
  });
  modal.present();
};
</script>
