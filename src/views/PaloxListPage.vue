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
            :rowData="data"
            :columnDefs="columnDefs"
            :defaultColDef="defaultColDef"
            @grid-ready="onGridReady"
            :gridOptions="gridOptions"
          />
        </div>
      </div>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="$router.push('/palox/new')">
          <ion-icon :icon="archive"></ion-icon>
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
import { onMounted, ref, watch } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { AG_GRID_LOCALE_DE } from "@ag-grid-community/locale";
import { ColDef } from "ag-grid-community";
import { fetchPaloxesInStock } from "@/services/palox-service";
import { ellipsisVertical, ellipsisHorizontal, archive } from "ionicons/icons";
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
  onIonViewWillLeave,
} from "@ionic/vue";
import { PaloxesInStockView } from "@/types/generated/paloxes-in-stock-view";
import { useDbAction } from "@/composables/use-db-action";

const gridOptions = {
  localeText: AG_GRID_LOCALE_DE,
  pagination: true,
  paginationPageSize: 20,
  paginationPageSizeSelector: false,
};

const columnDefs = ref<ColDef<PaloxesInStockView>[]>([
  { headerName: "Paloxen-Nr", field: "palox_display_name" },
  { headerName: "Produkt", field: "product_display_name" },
  { headerName: "Kunde", field: "customer_person_display_name" },
  { headerName: "Lieferant", field: "supplier_person_display_name" },
  { headerName: "Lagerplatz", field: "stock_location_display_name" },
  {
    headerName: "Eingelagert",
    field: "stored_at",
    valueFormatter: (params) => {
      if (!params.value) {
        return "";
      }

      return params.value.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
]);

const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  flex: 1,
  minWidth: 100,
};

const { data, error, execute } = useDbAction(fetchPaloxesInStock);

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

onMounted(async () => {
  window.addEventListener("resize", handleResize);
  await execute();
});

watch(error, (err) => {
  if (err) {
    presentToast(err.message, "danger", 10000);
  }
});

onIonViewWillLeave(() => {
  window.removeEventListener("resize", handleResize);
});

function exportAsPDF() {
  if (!gridApi.value) return;

  const filteredSortedData: PaloxesInStockView[] = [];
  gridApi.value.forEachNodeAfterFilterAndSort((node: any) => {
    filteredSortedData.push(node.data as PaloxesInStockView);
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
    field: keyof PaloxesInStockView;
  }[] = gridApi.value.getAllDisplayedColumns().map((col: any) => ({
    headerName: col.getColDef().headerName,
    field: col.getColDef().field as keyof PaloxesInStockView,
  }));

  const headers = displayedColumns.map((c) => c.headerName);

  const rows = filteredSortedData.map((row) =>
    displayedColumns.map((c) => {
      let value = row[c.field];
      if (value instanceof Date) {
        return value.toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
      return value === null || value === undefined ? "" : String(value);
    })
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
