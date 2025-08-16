<template>
  <div class="grid-container">
    <ag-grid-vue
      class="ag-theme-alpine ag-grid full-screen"
      :rowData="rowData"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :gridOptions="gridOptions"
      @grid-ready="onGridReady"
    />
  </div>
</template>

<script setup lang="ts" generic="T extends object">
import { ref } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { AG_GRID_LOCALE_DE } from "@ag-grid-community/locale";

export type AgGridWrapperExposed<T> = {
  getApi: () => GridApi<T> | null;
};

interface AgGridWrapperProps<T> {
  rowData: T[];
  columnDefs: ColDef<T>[];
}

defineProps<AgGridWrapperProps<T>>();

const gridApi = ref<GridApi | null>(null);

const defaultColDef: ColDef<T> = {
  sortable: true,
  filter: true,
  resizable: true,
  flex: 1,
  minWidth: 100,
};

const gridOptions: GridOptions = {
  localeText: AG_GRID_LOCALE_DE,
  pagination: true,
  paginationPageSize: 20,
  paginationPageSizeSelector: false,
};

function onGridReady(params: { api: GridApi }) {
  gridApi.value = params.api;
}

defineExpose<AgGridWrapperExposed<T>>({
  getApi: () => gridApi.value,
});
</script>

<style scoped>
.grid-container {
  height: 100%;
  width: 100%;
  overflow: auto;
}

.ag-grid.full-screen {
  height: 100%;
  width: 100%;
}

:deep(.ag-paging-row-summary-panel) {
  display: none !important;
}
</style>
