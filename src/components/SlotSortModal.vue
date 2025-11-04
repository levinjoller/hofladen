<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="prevStep" :disabled="currentStep === 1">
            <ion-icon :icon="chevronBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ title }} - {{ currentStep }} / 3</ion-title>
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
          <ModalSelectAsyncItem
            title="Lager"
            :fetchMethod="fetchStocks"
            :component="DropdownSearchAsyncModal"
            v-model="selectedStock"
            :isSearchable="false"
          />
        </ion-list>
      </div>

      <div v-else-if="currentStep === 2">
        <StockColumnSlotSelectAsyncPage
          v-if="selectedStock"
          v-model="selectedStockColumnSlot"
          :selectedStock="selectedStock"
          :activeStrategy="activeStrategy"
        />
      </div>

      <div v-else-if="currentStep === 3">
        <DroppableSlotContentAsyncPage
          v-if="selectedStockColumnSlot && selectedStock"
          :slot="selectedStockColumnSlot"
          :selectedStock="selectedStock"
          @initial-order="handleInitialReorder"
          @changed-order="handleChangedReorder"
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
            <span v-else>{{ currentStep > 2 ? "Speichern" : "Weiter" }}</span>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted } from "vue";
import { storeToRefs } from "pinia";
import {
  modalController,
  IonContent,
  IonPage,
  IonButton,
  IonButtons,
  IonTitle,
  IonHeader,
  IonToolbar,
  IonIcon,
  IonList,
  IonFooter,
  IonSpinner,
} from "@ionic/vue";
import { chevronBackOutline, closeOutline } from "ionicons/icons";
import { useSlotReorderStore } from "@/stores/slot-reorder-store";
import { fetchStocks } from "@/services/palox-create-service";
import { presentToast } from "@/services/toast-service";
import type { DropdownSearchItem } from "@/types/dropdown-search-item";
import type { SlotSelectionStrategy } from "@/types/slot-selection-strategy";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const DropdownSearchAsyncModal = defineAsyncComponent({
  loader: () => import("@/components/DropdownSearchModal.vue"),
  loadingComponent: LoadingSpinner,
  delay: 200,
});
const ModalSelectAsyncItem = defineAsyncComponent({
  loader: () => import("@/components/ModalSelectItem.vue"),
  loadingComponent: LoadingSpinner,
  delay: 200,
});
const StockColumnSlotSelectAsyncPage = defineAsyncComponent({
  loader: () => import("@/components/StockColumnSlotSelectPage.vue"),
  loadingComponent: LoadingSpinner,
  delay: 200,
});
const DroppableSlotContentAsyncPage = defineAsyncComponent({
  loader: () => import("@/components/DroppableSlotContentPage.vue"),
  loadingComponent: LoadingSpinner,
  delay: 200,
});

const props = defineProps<{
  title: string;
  currentStock: DropdownSearchItem | null;
  activeStrategy: SlotSelectionStrategy;
}>();

const slotReorderStore = useSlotReorderStore();
const { prevStep, nextStep } = slotReorderStore;
const {
  currentStep,
  canProceed,
  isActionLoading,
  selectedStock,
  selectedStockColumnSlot,
  actionErrorMessage,
} = storeToRefs(slotReorderStore);

onMounted(() => {
  slotReorderStore.initializeState(props.currentStock, props.activeStrategy);
});

async function handleNext() {
  const { success, parentReloadRequired, closeModal } = await nextStep();
  if (success) {
    if (closeModal) {
      const toastMessage = buildSuccessToastMessage();
      presentToast(toastMessage, "success", 6000);
      closeStepperModal(parentReloadRequired);
    }
  } else {
    if (actionErrorMessage.value) {
      presentToast(actionErrorMessage.value, "danger", 10000);
    }
  }
}

function buildSuccessToastMessage(): string {
  const stockName =
    selectedStock.value?.display_name ?? "im ausgewählten Lager";
  const slotDisplayNames = selectedStockColumnSlot.value
    .map((slot) => slot.display_name)
    .join(", ");
  return `Umsortierung erfolgreich gespeichert! (Lager: ${stockName}; Plätze: ${slotDisplayNames})`;
}

function handleInitialReorder(slotData: {
  slotId: number;
  paloxIds: number[];
}) {
  slotReorderStore.setOriginalOrder([slotData]);
}

function handleChangedReorder({
  slotId,
  paloxIds,
}: {
  slotId: number;
  paloxIds: number[];
}) {
  slotReorderStore.setReorderedPaloxes(slotId, paloxIds);
}

function closeStepperModal(requiresReload: boolean) {
  modalController.dismiss(requiresReload);
}
</script>
