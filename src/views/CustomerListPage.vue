<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Kunden Übersicht</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <AgGridWrapperAsync
        :rowData="data"
        :columnDefs="columnDefs"
        :isParentLoading="isLoading"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
} from "@ionic/vue";
import { defineAsyncComponent, onMounted, watch } from "vue";
import type { ColDef } from "ag-grid-community";
import { useDbFetch } from "@/composables/use-db-action";
import { presentToast } from "@/services/toast-service";
import { CustomerList } from "@/types/schemas/customer-list-schema";
import { fetchCustomersWithPerson } from "@/services/customer-service";
import { toLocaleDate } from "@/utils/date-formatters";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const AgGridWrapperAsync = defineAsyncComponent({
  loader: () => import("@/components/AgGridWrapper.vue"),
  loadingComponent: LoadingSpinner,
  delay: 200,
});

const columnDefs: ColDef<CustomerList>[] = [
  { headerName: "Name", field: "person.display_name" },
  {
    headerName: "Erstellt am",
    field: "created_at",
    valueFormatter: toLocaleDate,
  },
];

const { data, isLoading, errorMessage, execute } = useDbFetch<
  CustomerList,
  typeof fetchCustomersWithPerson
>(fetchCustomersWithPerson);

onMounted(async () => {
  await execute();
});

watch(errorMessage, (err) => {
  if (err) {
    presentToast(err, "danger", 10000);
  }
});
</script>
