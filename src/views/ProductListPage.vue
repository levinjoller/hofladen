<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Produkte Übersicht</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <AgGridWrapper
        :rowData="data"
        :columnDefs="columnDefs"
        :isParentLoading="isLoading"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
} from "@ionic/vue";
import { onMounted, watch } from "vue";
import AgGridWrapper from "@/components/AgGridWrapper.vue";
import { ColDef, ValueGetterParams } from "ag-grid-community";
import { toLocaleDate } from "@/utils/date-formatters";
import { useDbFetch } from "@/composables/use-db-action";
import { presentToast } from "@/services/toast-service";
import { fetchProducts } from "@/services/product-service";
import { ProductList } from "@/types/schemas/product-list-schema";

const getProductCellValue = (params: ValueGetterParams<ProductList>) => {
  const emoji = params.data?.type?.emoji ?? "";
  const typeDisplayName = params.data?.type?.display_name ?? "";
  return `${emoji} ${typeDisplayName}`;
};

const columnDefs: ColDef<ProductList>[] = [
  { headerName: "Bezeichnung", field: "display_name" },
  {
    headerName: "Kategorie",
    valueGetter: getProductCellValue,
  },
  {
    headerName: "Erstellt am",
    field: "created_at",
    valueFormatter: toLocaleDate,
  },
];

const { data, isLoading, errorMessage, execute } = useDbFetch(fetchProducts);

onMounted(async () => {
  await execute();
});

watch(errorMessage, (err) => {
  if (err) {
    presentToast(err, "danger", 10000);
  }
});
</script>
