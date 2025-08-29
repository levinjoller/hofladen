<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="prevStep" :disabled="currentStep === 1">
            <ion-icon :icon="chevronBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Paloxe einlagern - {{ currentStep }} / 3</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeStepperModal(false)">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="currentStep === 1">
        <ion-list>
          <ModalSelectItem
            title="Paloxenart"
            v-model="paloxType"
            :component="DropdownSearchModal"
            :fetchMethod="fetchPaloxTypes"
            :isSearchable="false"
            :isParentLoadingDefault="isLoading"
          />
          <ModalSelectItem
            title="Paloxennummer"
            v-model="selectedPalox"
            :component="DropdownSearchModal"
            :fetchMethod="fetchPaloxesWithPaloxType"
            :isSearchable="true"
            :searchType="'numeric'"
            :disabled="!paloxType"
          />
          <ModalSelectItem
            title="Lieferant"
            v-model="selectedSupplier"
            :component="DropdownSearchModal"
            :fetchMethod="fetchSuppliers"
            :isSearchable="true"
            :searchType="'text'"
          />
          <ModalSelectItem
            title="Produkt"
            v-model="selectedProduct"
            :component="DropdownSearchModal"
            :fetchMethod="fetchProducts"
            :isSearchable="true"
            :searchType="'text'"
          />
          <ModalSelectItem
            title="Lager"
            :fetchMethod="fetchStocks"
            :component="DropdownSearchModal"
            v-model="selectedStock"
            :isSearchable="false"
          />
          <ModalSelectItem
            title="Kunde"
            v-model="selectedCustomer"
            :component="DropdownSearchModal"
            :fetchMethod="fetchCustomers"
            :isSearchable="true"
            :searchType="'text'"
          />
        </ion-list>
      </div>

      <div v-else-if="currentStep === 2">
        <StockColumnSlotSelectPage
          v-if="selectedStock"
          v-model="selectedStockColumnSlot"
          :selectedStock="selectedStock"
        />
      </div>

      <div v-else-if="currentStep === 3">
        <DroppableSlotContentPage
          v-if="selectedStockColumnSlot"
          :slot="selectedStockColumnSlot"
        ></DroppableSlotContentPage>
      </div>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button
            @click="handleNext"
            :disabled="!canProceed || isActionLoading"
          >
            <ion-spinner v-if="isActionLoading" name="crescent"></ion-spinner>
            <span v-else>{{ currentStep > 1 ? "Speichern" : "Weiter" }}</span>
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
  IonIcon,
  IonSpinner,
  modalController,
  IonList,
} from "@ionic/vue";
import { closeOutline, chevronBackOutline, warning } from "ionicons/icons";
import { computed, defineAsyncComponent, onMounted, warn } from "vue";
import {
  fetchCustomers,
  fetchPaloxes,
  fetchPaloxTypes,
  fetchProducts,
  fetchStocks,
  fetchSuppliers,
} from "@/services/palox-create-service";
import { usePaloxStore } from "@/stores/palox-store";
import { presentToast } from "@/services/toast-service";
import { useDbFetch } from "@/composables/use-db-action";
import { storeToRefs } from "pinia";
import LoadingSpinner from "./LoadingSpinner.vue";
const DropdownSearchModal = defineAsyncComponent({
  loader: () => import("@/components/DropdownSearchModal.vue"),
  loadingComponent: LoadingSpinner,
  delay: 200,
});
const ModalSelectItem = defineAsyncComponent({
  loader: () => import("@/components/ModalSelectItem.vue"),
  loadingComponent: LoadingSpinner,
  delay: 200,
});
const StockColumnSlotSelectPage = defineAsyncComponent({
  loader: () => import("@/components/StockColumnSlotSelectPage.vue"),
  loadingComponent: LoadingSpinner,
  delay: 200,
});
const DroppableSlotContentPage = defineAsyncComponent({
  loader: () => import("@/components/DroppableSlotContentPage.vue"),
  loadingComponent: LoadingSpinner,
  delay: 200,
});
const paloxStore = usePaloxStore();
const { nextStep, prevStep, setSelectedPaloxType } = paloxStore;

const {
  canProceed,
  currentStep,
  isActionLoading,
  actionErrorMessage,
  selectedPalox,
  selectedSupplier,
  selectedCustomer,
  selectedProduct,
  selectedStock,
  selectedStockColumnSlot,
} = storeToRefs(paloxStore);

const paloxType = computed({
  get() {
    return paloxStore.getSelectedPaloxType;
  },
  set(newValue) {
    paloxStore.setSelectedPaloxType(newValue);
  },
});

async function fetchPaloxesWithPaloxType(searchTerm: number) {
  if (paloxType.value) {
    return await fetchPaloxes(searchTerm, paloxType.value.id);
  }
  presentToast("Fehlender Paloxtyp verhindert das Laden der Paloxen.", warning);
  return [];
}

async function handleNext() {
  const { success, showSuccessToast, closeModal } = await nextStep();
  if (success) {
    if (showSuccessToast) {
      presentToast(
        `Die Paloxe ${selectedPalox.value?.display_name} wurde erfolgreich zuoberst auf den Stapel ${selectedStockColumnSlot.value?.display_name} eingelagert!`,
        "success",
        6000
      );
    }
    if (closeModal) {
      closeStepperModal(true);
    }
  } else {
    if (actionErrorMessage.value) {
      presentToast(actionErrorMessage.value, "danger", 10000);
    }
  }
}

function closeStepperModal(requiresReload: boolean) {
  modalController.dismiss(requiresReload);
}

const { data, isLoading, execute } = useDbFetch(fetchPaloxTypes);

onMounted(async () => {
  await execute(true);
  if (data.value && data.value.length > 0) {
    setSelectedPaloxType(data.value[0]);
  } else {
    presentToast(
      "Es wurde keinen Standardwert für die Paloxenart gefunden.",
      warning
    );
  }
});
</script>
