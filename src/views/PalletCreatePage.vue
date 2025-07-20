<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/pallet" />
        </ion-buttons>
        <ion-title>Paloxe erfassen</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item button @click="isSupplierModalOpen = true">
          <ion-label>Lieferant</ion-label>
          <ion-text>{{ selectedSupplier || "Bitte wählen" }}</ion-text>
        </ion-item>
        <AutocompleteModal
          v-model:modelValue="isSupplierModalOpen"
          v-model:selected="selectedSupplier"
          :options="suppliers"
          title="Lieferant"
        />

        <ion-item button @click="isCustomerModalOpen = true">
          <ion-label>Kunde</ion-label>
          <ion-text>{{ selectedCustomer || "Bitte wählen" }}</ion-text>
        </ion-item>
        <AutocompleteModal
          v-model:modelValue="isCustomerModalOpen"
          v-model:selected="selectedCustomer"
          :options="customers"
          title="Kunde"
        />

        <ion-item button @click="isProductModalOpen = true">
          <ion-label>Produkt</ion-label>
          <ion-text>{{ selectedProduct || "Bitte wählen" }}</ion-text>
        </ion-item>
        <AutocompleteModal
          v-model:modelValue="isProductModalOpen"
          v-model:selected="selectedProduct"
          :options="products"
          title="Produkt"
        />

        <ion-item button @click="isStockModalOpen = true">
          <ion-label>Lager</ion-label>
          <ion-text>{{ selectedStock || "Bitte wählen" }}</ion-text>
        </ion-item>
        <AutocompleteModal
          v-model:modelValue="isStockModalOpen"
          v-model:selected="selectedStock"
          :options="stocks"
          title="Lager"
        />
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonText,
  IonList,
  IonButtons,
  IonBackButton,
} from "@ionic/vue";
import { ref } from "vue";
import AutocompleteModal from "@/components/AutocompleteModal.vue";

const isSupplierModalOpen = ref(false);
const isCustomerModalOpen = ref(false);
const isProductModalOpen = ref(false);
const isStockModalOpen = ref(false);

const selectedSupplier = ref("");
const selectedCustomer = ref("");
const selectedProduct = ref("");
const selectedStock = ref("");

const suppliers = ref(["Supplier A", "Supplier B", "Supplier C"]);
const customers = ref(["Customer X", "Customer Y", "Customer Z"]);
const products = ref(["Product 1", "Product 2", "Product 3"]);
const stocks = ref(["Stock 1", "Stock 2", "Stock 3"]);
</script>
