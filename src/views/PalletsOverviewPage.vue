<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Paloxen Übersicht</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="ag-theme-quartz ag-grid-wrapper">
        <ag-grid-vue
          class="ag-grid"
          style="width: 100%; height: 100%;"
          :rowData="rowData"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :rowSelection="{mode: 'singleRow'}"
          @grid-ready="onGridReady"
          :gridOptions="gridOptions"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3';
import { onMounted, ref } from 'vue';
import { loadPalletData, pallets } from '@/services/palletService';
import { AG_GRID_LOCALE_DE } from '@ag-grid-community/locale';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton
} from '@ionic/vue';
const gridOptions = {
    localeText: AG_GRID_LOCALE_DE,
}
const rowData = ref<any[]>([]);
const columnDefs = ref([
  { headerName: 'Paloxen-Nr', field: 'id' },
  { headerName: 'Produkt', field: 'product_name' },
  { headerName: 'Kunde', field: 'customer_name' },
  { headerName: 'Lieferant', field: 'supplier_name' },
  { headerName: 'Lagerplatz', field: 'slot_level' },
]);

const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  flex: 1,
  minWidth: 100,
};

onMounted(async () => {
  await loadPalletData();
  rowData.value = pallets.value;
});

const gridApi = ref<any>(null);

function onGridReady(params: any) {
  gridApi.value = params.api;
  params.api.sizeColumnsToFit();
}
</script>

<style scoped>
.ag-grid-wrapper {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow-x: auto;
}
</style>
