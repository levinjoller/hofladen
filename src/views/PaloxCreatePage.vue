<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/palox" />
        </ion-buttons>
        <ion-title>Paloxe erfassen - Schritt {{ currentStep }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="currentStep === 1">
        <ion-list>
          <ion-item button @click="isSupplierModalOpen = true">
            <ion-label>Lieferant</ion-label>
            <ion-text>
              {{ selectedSupplier?.display_name || "Bitte wählen" }}
            </ion-text>
          </ion-item>
          <DropdownSearchModal
            v-model="isSupplierModalOpen"
            v-model:selected="selectedSupplier"
            title="Lieferanten"
            :options="suppliers"
            :loading="suppliersLoading"
            :fetch-method="() => fetchSuppliers(false)"
          />

          <ion-item button @click="isCustomerModalOpen = true">
            <ion-label>Kunde</ion-label>
            <ion-text>
              {{ selectedCustomer?.display_name || "Bitte wählen" }}
            </ion-text>
          </ion-item>
          <DropdownSearchModal
            v-model="isCustomerModalOpen"
            v-model:selected="selectedCustomer"
            title="Kunden"
            :options="customers"
            :loading="customersLoading"
            :fetch-method="() => fetchCustomers(false)"
          />

          <ion-item button @click="isProductModalOpen = true">
            <ion-label>Produkt</ion-label>
            <ion-text>
              {{ selectedProduct?.display_name || "Bitte wählen" }}
            </ion-text>
          </ion-item>
          <DropdownSearchModal
            v-model="isProductModalOpen"
            v-model:selected="selectedProduct"
            title="Produkte"
            :options="products"
            :loading="productsLoading"
            :fetch-method="() => fetchProducts(false)"
          />

          <ion-item button @click="isStockModalOpen = true">
            <ion-label>Lager</ion-label>
            <ion-text>
              {{ selectedStock?.display_name || "Bitte wählen" }}
            </ion-text>
          </ion-item>
          <DropdownSearchModal
            v-model="isStockModalOpen"
            v-model:selected="selectedStock"
            title="Lager"
            :options="stocks"
            :loading="stocksLoading"
            :fetch-method="() => fetchStocks(false)"
          />
        </ion-list>
      </div>
      <div v-else-if="currentStep === 2">
        <ion-grid>
          <h2>Lager {{ selectedStock?.display_name }} - Lagerplatz wählen</h2>
          <ion-row v-for="(row, rowIndex) in rows" :key="rowIndex">
            <ion-col v-for="(col, colIndex) in columns" :key="colIndex">
              <ion-card
                :color="isSelected(`${col}${row}`) ? 'primary' : ''"
                @click="toggleSelect(`${col}${row}`)"
              >
                <ion-card-content class="ion-text-center">
                  {{ col }}{{ row }}
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
      <div v-else-if="currentStep === 3"></div>
    </ion-content>

    <ion-footer class="ion-padding">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="prevStep" :disabled="currentStep === 1">
            Zurück
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="nextStep" :disabled="!canProceed">
            Weiter
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonFooter,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";
import { ref, computed } from "vue";
import DropdownSearchModal from "@/components/DropdownSearchModal.vue";
import {
  suppliers,
  suppliersLoading,
  fetchSuppliers,
  customers,
  customersLoading,
  fetchCustomers,
  products,
  productsLoading,
  fetchProducts,
  stocks,
  stocksLoading,
  fetchStocks,
} from "@/services/palox-create-service";
import { DropdownSearchItem } from "@/types/dropdown-search-item";
import { presentToast } from "@/services/toast-service";

const isSupplierModalOpen = ref(false);
const isCustomerModalOpen = ref(false);
const isProductModalOpen = ref(false);
const isStockModalOpen = ref(false);

const selectedSupplier = ref<DropdownSearchItem | null>(null);
const selectedCustomer = ref<DropdownSearchItem | null>(null);
const selectedProduct = ref<DropdownSearchItem | null>(null);
const selectedStock = ref<DropdownSearchItem | null>(null);

const currentStep = ref(1);
const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return (
      selectedCustomer.value !== null &&
      selectedSupplier.value !== null &&
      selectedStock.value !== null &&
      selectedProduct.value !== null
    );
  } else if (currentStep.value === 2) {
    return selectedSlot.value !== null;
  }
  return false;
});

const nextStep = () => {
  if (canProceed.value) {
    currentStep.value++;
  } else {
    presentToast("Bitte füllen Sie alle erforderlichen Felder aus.", "warning");
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const columns = ref(["A", "B", "C", "D"]);
const rows = ref([1, 2, 3, 4, 5]);

const selectedSlot = ref<string | null>(null);

const isSelected = (slot: string) => {
  return selectedSlot.value === slot;
};

const toggleSelect = (slot: string) => {
  if (selectedSlot.value === slot) {
    selectedSlot.value = null;
  } else {
    selectedSlot.value = slot;
  }
};
</script>

<style scoped>
ion-card {
  cursor: pointer;
  transition: transform 0.2s;
}
ion-card:hover {
  transform: scale(1.05);
}
</style>
