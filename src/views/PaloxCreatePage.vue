<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/palox" />
        </ion-buttons>
        <ion-title>Paloxe einlagern - {{ currentStep }} / 3</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="currentStep === 1">
        <ion-list>
          <ion-item button @click="isPaloxModalOpen = true">
            <ion-label>Paloxe</ion-label>
            <ion-text>
              {{ selectedPalox?.display_name || "Bitte wählen" }}
            </ion-text>
          </ion-item>
          <DropdownSearchModal
            v-model="isPaloxModalOpen"
            v-model:selected="selectedPalox"
            title="Paloxen"
            :fetchMethod="fetchPaloxes"
          />

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
            :fetchMethod="fetchSuppliers"
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
            :fetchMethod="fetchProducts"
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
            :fetchMethod="fetchStocks"
          />
        </ion-list>

        <h3>Optional</h3>
        <ion-item button @click="isCustomerModalOpen = true">
          <ion-label>Kunde</ion-label>
          <ion-text>
            {{ selectedCustomer?.display_name || "Bitte wählen" }}
          </ion-text>
          <ion-buttons slot="end" v-if="selectedCustomer">
            <ion-button @click.stop="selectedCustomer = null">
              <ion-icon :icon="closeCircleOutline" />
            </ion-button>
          </ion-buttons>
        </ion-item>
        <DropdownSearchModal
          v-model="isCustomerModalOpen"
          v-model:selected="selectedCustomer"
          title="Kunden"
          :fetchMethod="fetchCustomers"
        />
      </div>

      <div v-else-if="currentStep === 2">
        <StockColumnSlotSelectPage
          v-model="selectedStockColumnSlot"
          :selectedStock="selectedStock"
        />
      </div>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button
            @click="prevStep"
            :disabled="currentStep === 1"
            v-if="currentStep <= 2"
          >
            Zurück
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="nextStep" :disabled="!canProceed || isLoading">
            <span v-if="!isLoading">{{
              currentStep === 2 ? "Einlagern" : "Weiter"
            }}</span>
            <ion-spinner v-else name="dots"></ion-spinner>
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
  IonIcon,
  IonSpinner,
} from "@ionic/vue";
import { ref, computed, defineAsyncComponent } from "vue";
import {
  assignPaloxToSlot,
  fetchCustomers,
  fetchPaloxes,
  fetchProducts,
  fetchStocks,
  fetchSuppliers,
} from "@/services/palox-create-service";
const DropdownSearchModal = defineAsyncComponent(
  () => import("@/components/DropdownSearchModal.vue")
);
const StockColumnSlotSelectPage = defineAsyncComponent(
  () => import("@/components/StockColumnSlotSelectPage.vue")
);
import type { DropdownSearchItem } from "@/types/dropdown-search-item";
import { closeCircleOutline } from "ionicons/icons";
import { useDbAction } from "@/composables/use-db-action";
import { presentToast } from "@/services/toast-service";
import { StockColumnSlotViewModel } from "@/types/stock-column-slot-view-model";

const isPaloxModalOpen = ref(false);
const isSupplierModalOpen = ref(false);
const isCustomerModalOpen = ref(false);
const isProductModalOpen = ref(false);
const isStockModalOpen = ref(false);

const selectedPalox = ref<DropdownSearchItem | null>(null);
const selectedSupplier = ref<DropdownSearchItem | null>(null);
const selectedCustomer = ref<DropdownSearchItem | null>(null);
const selectedProduct = ref<DropdownSearchItem | null>(null);
const selectedStock = ref<DropdownSearchItem | null>(null);
const selectedStockColumnSlot = ref<StockColumnSlotViewModel | null>(null);

const currentStep = ref(1);

const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return (
      selectedPalox.value &&
      selectedSupplier.value &&
      selectedProduct.value &&
      selectedStock.value
    );
  }
  if (currentStep.value === 2) {
    return selectedStockColumnSlot.value !== null;
  }
  return false;
});

const { isLoading, errorMessage, execute } = useDbAction(assignPaloxToSlot);

const nextStep = async () => {
  if (
    currentStep.value === 2 &&
    selectedPalox.value !== null &&
    selectedStockColumnSlot.value !== null &&
    selectedProduct.value !== null &&
    selectedSupplier.value !== null
  ) {
    const success = await execute({
      paloxId: selectedPalox.value.id,
      stockColumnSlotId: selectedStockColumnSlot.value.slot_id,
      productId: selectedProduct.value.id,
      supplierId: selectedSupplier.value.id,
      customerId: selectedCustomer.value?.id,
    });
    if (!success) {
      if (errorMessage.value) {
        presentToast(errorMessage.value, "danger", 10000);
      }
      return;
    }
    presentToast(
      `Paloxe ${selectedPalox.value.display_name} in ${selectedStockColumnSlot.value.display_name} erfolgreich zuoberst eingelagert!`,
      "success"
    );
    currentStep.value++;
  } else {
    currentStep.value++;
  }
};
const prevStep = () => currentStep.value > 1 && currentStep.value--;
</script>
