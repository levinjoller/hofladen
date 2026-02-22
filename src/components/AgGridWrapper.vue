<template>
  <div class="grid-container">
    <ag-grid-vue
      class="ag-theme-alpine ag-grid"
      :rowData="rowData"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :gridOptions="optimizedGridOptions"
      :loading="isParentLoading"
      @grid-ready="onGridReady"
    />
  </div>
</template>

<script setup lang="ts" generic="T extends object">
import { ref } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { AG_GRID_LOCALE_DE } from "@ag-grid-community/locale";
import {
  AgGridWrapperExposed,
  AgGridWrapperProps,
} from "@/types/ag-grid-wrapper";

const props = defineProps<AgGridWrapperProps<T>>();
const gridApi = ref<GridApi | null>(null);

const defaultColDef: ColDef<T> = {
  sortable: true,
  filter: true,
  resizable: true,
  flex: 1,
  minWidth: 100,
};

const optimizedGridOptions: GridOptions = {
  localeText: AG_GRID_LOCALE_DE,
  pagination: true,
  paginationPageSize: 20,
  paginationPageSizeSelector: false,
  suppressMovableColumns: true,
  components: props.customComponents,
  rowBuffer: 2,
  rowHeight: 45,
  suppressColumnVirtualisation: true,
  animateRows: false,
  domLayout: "normal",
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
  position: relative;
  overflow: hidden;
}

.ag-grid {
  height: 100%;
  width: 100%;
}

:deep(.ag-overlay-loading-wrapper) {
  background-color: rgba(255, 255, 255, 0.5);
}

:deep(.ag-paging-row-summary-panel) {
  display: none !important;
}
</style>
