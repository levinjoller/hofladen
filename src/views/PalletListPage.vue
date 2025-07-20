<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Paloxen Übersicht</ion-title>
        <ion-buttons slot="primary">
          <ion-button id="menu-action-trigger">
            <ion-icon
              slot="icon-only"
              :ios="ellipsisHorizontal"
              :md="ellipsisVertical"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="grid-container">
        <div class="ag-theme-quartz ag-grid-wrapper">
          <ag-grid-vue
            class="ag-grid"
            style="width: 100%; height: 100%"
            :rowData="rowData"
            :columnDefs="columnDefs"
            :defaultColDef="defaultColDef"
            :rowSelection="{ mode: 'singleRow' }"
            @grid-ready="onGridReady"
            :gridOptions="gridOptions"
          />
        </div>
      </div>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="$router.push('/pallet/new')">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-popover trigger="menu-action-trigger">
        <ion-content class="ion-padding">
          <ion-item button lines="none" @click="exportAsPDF">
            Tabelle exportieren
          </ion-item>
        </ion-content>
      </ion-popover>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { AG_GRID_LOCALE_DE } from "@ag-grid-community/locale";
import { ColDef } from "ag-grid-community";
import { loadPalletsForList, pallets } from "@/services/pallet-service";
import { AgGridPalletRow } from "@/types/ag-grid-pallet-row";
import { ellipsisVertical, ellipsisHorizontal, add } from "ionicons/icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { presentToast } from "@/services/toast-service";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  onIonViewDidEnter,
  IonIcon,
  IonPopover,
  IonButton,
  IonItem,
  IonFab,
  IonFabButton,
} from "@ionic/vue";

const gridOptions = {
  localeText: AG_GRID_LOCALE_DE,
  pagination: true,
  paginationPageSize: 20,
  paginationPageSizeSelector: false,
};

const rowData = ref<AgGridPalletRow[]>([]);

const columnDefs = ref<ColDef<AgGridPalletRow>[]>([
  { headerName: "Paloxen-Nr", field: "pallet_id" },
  { headerName: "Produkt", field: "product_name" },
  { headerName: "Kunde", field: "customer_name" },
  { headerName: "Lieferant", field: "supplier_name" },
  { headerName: "Lagerplatz", field: "stock_column_row_level" },
]);

const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  flex: 1,
  minWidth: 100,
};

onMounted(async () => {
  await loadPalletsForList();
  rowData.value = pallets.value;
});

const gridApi = ref<any>(null);

function onGridReady(params: any) {
  gridApi.value = params.api;
}

onIonViewDidEnter(() => {
  handleResize();
});

const handleResize = () => {
  if (gridApi.value) {
    gridApi.value.sizeColumnsToFit();
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

function exportAsPDF() {
  if (!gridApi.value) return;

  const filteredSortedData: AgGridPalletRow[] = [];
  gridApi.value.forEachNodeAfterFilterAndSort((node: any) => {
    filteredSortedData.push(node.data as AgGridPalletRow);
  });

  if (!filteredSortedData.length) {
    presentToast("Keine Daten zum Exportieren.", "warning");
    return;
  }

  const doc = new jsPDF();
  doc.text(
    `Paloxenübersicht vom ${new Date().toLocaleString("de-DE")}`,
    14,
    10
  );

  const displayedColumns: {
    headerName: string;
    field: keyof AgGridPalletRow;
  }[] = gridApi.value.getAllDisplayedColumns().map((col: any) => ({
    headerName: col.getColDef().headerName,
    field: col.getColDef().field as keyof AgGridPalletRow,
  }));

  const headers = displayedColumns.map((c) => c.headerName);
  const rows = filteredSortedData.map((row) =>
    displayedColumns.map((c) => row[c.field] || "")
  );

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 20,
    styles: { fontSize: 8 },
  });

  const fileName = `paloxen_${new Date()
    .toLocaleString("de-DE")
    .replace(/\./g, "")
    .replace(", ", "_")
    .replace(/:/g, "")}`;

  doc.save(`${fileName}.pdf`);

  presentToast("Tabelle erfolgreich exportiert.", "success");
}
</script>

<style scoped>
.grid-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: 70px;
}

.ag-grid-wrapper {
  flex: 1;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow-x: auto;
}

.ag-grid {
  flex: 1;
  min-height: 0;
}

:deep(.ag-paging-row-summary-panel) {
  display: none !important;
}
</style>
