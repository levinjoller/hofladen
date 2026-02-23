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
      <AgGridWrapperAsync
        ref="gridRef"
        :rowData="data"
        :columnDefs="columnDefs"
        :isParentLoading="isLoading"
        :customComponents="customComponents"
      />

      <ion-popover trigger="menu-action-trigger">
        <ion-content class="ion-padding">
          <ion-item button lines="none" @click="onExportClick">
            Tabelle exportieren
          </ion-item>
        </ion-content>
      </ion-popover>
    </ion-content>
    <PaloxTabs @refetchParentData="refetchData" />
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineAsyncComponent } from "vue";
import type { ColDef, ValueGetterParams } from "ag-grid-community";
import { ellipsisHorizontal, ellipsisVertical } from "ionicons/icons";
import { isPlatform } from "@ionic/vue";
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
} from "@ionic/vue";
import { fetchPaloxesInStock } from "@/services/palox-service";
import { useDbFetch } from "@/composables/use-db-action";
import { PaloxesInStockView } from "@/types/generated/views/paloxes-in-stock-view";
import { toLocaleDate } from "@/utils/date-formatters";
import { presentToast } from "@/services/toast-service";
import type { AgGridWrapperExposed } from "@/types/ag-grid-wrapper";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import PaloxTabs from "@/components/PaloxTabs.vue";
import StockMapButton from "@/components/StockMapButton.vue";

const AgGridWrapperAsync = defineAsyncComponent({
  loader: () => import("@/components/AgGridWrapper.vue"),
  loadingComponent: LoadingSpinner,
  delay: 200,
});

const customComponents = {
  StockMapButton,
};

const getProductCellValue = (params: ValueGetterParams<PaloxesInStockView>) => {
  const typeEmoji = params.data?.product_type_emoji ?? "";
  const productDisplayName = params.data?.product_display_name ?? "";
  return `${typeEmoji} ${productDisplayName}`;
};

const columnDefs: ColDef<PaloxesInStockView>[] = [
  { headerName: "Paloxen-Nr", field: "palox_display_name" },
  {
    headerName: "Produkt",
    valueGetter: getProductCellValue,
  },
  { headerName: "Kunde", field: "customer_person_display_name" },
  { headerName: "Lieferant", field: "supplier_person_display_name" },
  { headerName: "Lagerplatz", field: "stock_location_display_name" },
  {
    headerName: "Eingelagert",
    field: "stored_at",
    valueFormatter: toLocaleDate,
  },
  {
    headerName: "Info",
    field: "id",
    pinned: "right",
    width: 100,
    cellRenderer: "StockMapButton",
    sortable: false,
    filter: false,
    resizable: false,
  },
];

const { data, isLoading, errorMessage, execute } = useDbFetch<
  PaloxesInStockView,
  typeof fetchPaloxesInStock
>(fetchPaloxesInStock);

onMounted(async () => {
  await execute();
});

watch(errorMessage, (err) => {
  if (err) presentToast(err, "danger", 10000);
});

const gridRef = ref<AgGridWrapperExposed<PaloxesInStockView> | null>(null);

const refetchData = async () => {
  await execute();
};

const actionIcon = isPlatform("ios") ? ellipsisHorizontal : ellipsisVertical;

async function onExportClick() {
  const api = gridRef.value?.getApi();
  if (!api) return;

  const rows: PaloxesInStockView[] = [];
  api.forEachNodeAfterFilterAndSort((node) => {
    if (node.data) rows.push(node.data);
  });
  const exportColumnDefs = columnDefs.filter((colDef) => {
    return colDef.headerName !== "Info";
  });
  try {
    const { exportDataAsPDF } = await import("@/utils/ag-grid-export");
    await exportDataAsPDF(rows, exportColumnDefs, "Paloxen");
    presentToast(
      "Pdf erfolgreich generiert und zum Download bereit.",
      "success",
    );
  } catch (error) {
    presentToast(`Pdf-Export fehlgeschlagen: ${error}`, "danger", 10000);
  }
}
</script>
