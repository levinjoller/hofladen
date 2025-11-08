<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="prevStep" :disabled="currentStep === 1">
            <ion-icon :icon="chevronBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ title }} - {{ currentStep }} / 2</ion-title>
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
            v-model="selectedPaloxType"
            :component="DropdownSearchModal"
            :fetchMethod="fetchPaloxTypes"
            :isSearchable="false"
            :isParentLoadingDefault="isLoading"
          />
          <ion-item>
            <ion-label position="fixed">Paloxen-Nr.</ion-label>
            <ion-input
              class="ion-text-right"
              v-model.number="selectedPaloxNumber"
              type="number"
              inputmode="numeric"
              placeholder="0000"
              pattern="[0-9]*"
              min="1"
              max="9999"
              @keydown="digitsOnly"
              @paste.prevent
              @drop.prevent
              :maxlength="4"
              :disabled="!selectedPaloxType"
            ></ion-input>
          </ion-item>
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
          v-model="singleSlotAsArray"
          :selectedStock="selectedStock"
          :activeStrategy="activeStrategy"
        />
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
  IonItem,
  IonLabel,
  IonInput,
} from "@ionic/vue";
import { closeOutline, chevronBackOutline, warning } from "ionicons/icons";
import { computed, defineAsyncComponent, onMounted, watch } from "vue";
import {
  fetchCustomers,
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
import { isNumericKey } from "@/utils/is-numeric-key";
import { SlotSelectionStrategy } from "@/types/slot-selection-strategy";
import { SlotContent } from "@/types/schemas/slot-content-schema";
import { DropdownSearchItem } from "@/types/dropdown-search-item";
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

const props = defineProps<{
  title: string;
  activeStrategy: SlotSelectionStrategy;
  currentStock: DropdownSearchItem | null;
}>();

function digitsOnly(event: KeyboardEvent) {
  !isNumericKey(event) && event.preventDefault();
}

const paloxStore = usePaloxStore();
const { nextStep, prevStep } = paloxStore;

const {
  canProceed,
  currentStep,
  isActionLoading,
  actionErrorMessage,
  selectedPaloxType,
  selectedPaloxNumber,
  selectedSupplier,
  selectedCustomer,
  selectedProduct,
  selectedStock,
  selectedStockColumnSlot,
} = storeToRefs(paloxStore);

const singleSlotAsArray = computed({
  get: () =>
    selectedStockColumnSlot.value ? [selectedStockColumnSlot.value] : null,
  set: (newArray: SlotContent[] | null) => {
    paloxStore.setSelectedSlot(
      newArray && newArray.length > 0 ? newArray[0] : null
    );
  },
});

function setNumberInRange(val: number): number {
  return Math.min(Math.max(val, 0), 9999);
}

watch(selectedPaloxNumber, (val) => {
  if (val != null) selectedPaloxNumber.value = setNumberInRange(val);
});

async function handleNext() {
  const { success, parentReloadRequired, closeModal } = await nextStep();
  if (success) {
    if (closeModal) {
      presentToast(
        `Die Paloxe (${selectedPaloxNumber.value}) wurde erfolgreich zuoberst auf den Stapel ${selectedStockColumnSlot.value?.display_name} eingelagert!`,
        "success",
        6000
      );
      closeStepperModal(parentReloadRequired);
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
  paloxStore.initializeState(props.currentStock, data.value);
  if (!data.value || data.value.length === 0) {
    presentToast(
      "Es wurde keinen Standardwert für die Paloxenart gefunden.",
      warning
    );
  }
});
</script>
