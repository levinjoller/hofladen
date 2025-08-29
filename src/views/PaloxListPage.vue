<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button />
        </ion-buttons>
        <ion-title>Paloxen Übersicht</ion-title>
        <ion-buttons slot="primary">
          <ion-button id="menu-action-trigger">
            <ion-icon slot="icon-only" :icon="actionIcon" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <AgGridWrapper ref="gridRef" :rowData="data" :columnDefs="columnDefs" />

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="openPaloxIntoStockStepperModal">
          <ion-icon :icon="archive" />
        </ion-fab-button>
      </ion-fab>

      <ion-popover trigger="menu-action-trigger">
        <ion-content class="ion-padding">
          <ion-item button lines="none" @click="onExportClick">
            Tabelle exportieren
          </ion-item>
        </ion-content>
      </ion-popover>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineAsyncComponent } from "vue";
import { ColDef } from "ag-grid-community";
import { archive, ellipsisHorizontal, ellipsisVertical } from "ionicons/icons";
import { isPlatform, modalController } from "@ionic/vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonPopover,
  IonButton,
  IonItem,
  IonFab,
  IonFabButton,
} from "@ionic/vue";

import AgGridWrapper, {
  AgGridWrapperExposed,
} from "@/components/AgGridWrapper.vue";
import { fetchPaloxesInStock } from "@/services/palox-service";
import { useDbFetch } from "@/composables/use-db-action";
import { PaloxesInStockView } from "@/types/generated/views/paloxes-in-stock-view";
import { toLocaleDate } from "@/utils/date-formatters";
import { presentToast } from "@/services/toast-service";
import { exportDataAsPDF } from "@/utils/ag-grid-export";
import { usePaloxStore } from "@/stores/palox-store";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
const PaloxIntoStockStepperModal = defineAsyncComponent({
  loader: () => import("@/components/PaloxIntoStockStepperModal.vue"),
  loadingComponent: LoadingSpinner,
  delay: 200,
});

const columnDefs: ColDef<PaloxesInStockView>[] = [
  { headerName: "Paloxen-Nr", field: "palox_display_name" },
  { headerName: "Produkt", field: "product_display_name" },
  { headerName: "Kunde", field: "customer_person_display_name" },
  { headerName: "Lieferant", field: "supplier_person_display_name" },
  { headerName: "Lagerplatz", field: "stock_location_display_name" },
  {
    headerName: "Eingelagert",
    field: "stored_at",
    valueFormatter: toLocaleDate,
  },
];

const { data, errorMessage, execute } = useDbFetch(fetchPaloxesInStock);

onMounted(() => {
  execute();
});

watch(errorMessage, (err) => {
  if (err) presentToast(err, "danger", 10000);
});

const gridRef = ref<AgGridWrapperExposed<PaloxesInStockView> | null>(null);

const paloxStore = usePaloxStore();

const openPaloxIntoStockStepperModal = async () => {
  paloxStore.$reset();
  const modal = await modalController.create({
    component: PaloxIntoStockStepperModal,
  });
  await modal.present();
  const { data: requiresReload } = await modal.onDidDismiss<Boolean>();
  if (requiresReload) {
    await execute();
  }
};

const actionIcon = isPlatform("ios") ? ellipsisHorizontal : ellipsisVertical;

function onExportClick() {
  const api = gridRef.value?.getApi();
  if (!api) return;

  const rows: PaloxesInStockView[] = [];
  api.forEachNodeAfterFilterAndSort((node) => {
    if (node.data) rows.push(node.data);
  });

  exportDataAsPDF(rows, columnDefs, "Paloxen");
}
</script>

<style scoped>
.grid-container {
  padding-bottom: 80px;
}
</style>
