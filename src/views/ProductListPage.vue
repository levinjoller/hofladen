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
      <AgGridWrapper :rowData="data" :columnDefs="columnDefs" />
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
import { ColDef } from "ag-grid-community";
import { toLocaleDate } from "@/utils/date-formatters";
import { useDbFetch } from "@/composables/use-db-action";
import { presentToast } from "@/services/toast-service";
import { Product } from "@/types/generated/tables/products";
import { fetchProducts } from "@/services/product-service";

const columnDefs: ColDef<Product>[] = [
  { headerName: "Bezeichnung", field: "display_name" },
  {
    headerName: "Erstellt am",
    field: "created_at",
    valueFormatter: toLocaleDate,
  },
];

const { data, errorMessage, execute } = useDbFetch(fetchProducts);

onMounted(async () => {
  await execute();
});

watch(errorMessage, (err) => {
  if (err) {
    presentToast(err, "danger", 10000);
  }
});
</script>
