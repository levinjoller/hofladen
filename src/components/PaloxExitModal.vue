<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }} - {{ currentStep }} / 1</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeStepperModal(false)">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <SelectWithSearchAsync
          title="Paloxenart"
          v-model="selectedPaloxType"
          :fetchMethod="() => fetchPaloxTypes(false)"
          :isSearchable="false"
          :isParentLoading="isLoading"
        />
        <SelectWithSearchAsync
          title="Paloxennummer"
          v-model="selectedPalox"
          :fetchMethod="fetchPaloxesWrapper"
          :isSearchable="true"
          :searchType="SearchType.Numeric"
        />
      </ion-list>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button
            @click="handleNext"
            :disabled="!canProceed || isActionLoading"
          >
            <ion-spinner v-if="isActionLoading" name="crescent"></ion-spinner>
            <span v-else>{{ isFinalStep ? "Speichern" : "Weiter" }}</span>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, watch } from "vue";
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
import { closeOutline } from "ionicons/icons";
import { fetchStockedPaloxes } from "@/services/palox-create-service";
import { presentToast } from "@/services/toast-service";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { usePaloxExitStore } from "@/stores/palox-exit-store";
import { SearchType } from "@/types/search-type";
import { DropdownSearchItem } from "@/types/dropdown-search-item";
import { fetchPaloxTypes } from "@/services/palox-create-service";
import { useDbFetch } from "@/composables/use-db-action";

const SelectWithSearchAsync = defineAsyncComponent({
  loader: () => import("@/components/SelectWithSearch.vue"),
  loadingComponent: LoadingSpinner,
  delay: 200,
});

defineProps<{
  title: string;
}>();

const fetchPaloxesWrapper = (term?: number) => {
  if (!term || !selectedPaloxType.value) return Promise.resolve([]);
  return fetchStockedPaloxes(term, selectedPaloxType.value.id);
};

const paloxExitStore = usePaloxExitStore();
const { nextStep, setCurrentPaloxItem, setSelectedPaloxType, resetStore } =
  paloxExitStore;
const {
  currentStep,
  isActionLoading,
  getActionErrorMessage,
  getCurrentPaloxItem,
  getSelectedPaloxType,
  canProceed,
  isFinalStep,
} = storeToRefs(paloxExitStore);

const selectedPalox = computed({
  get: () => getCurrentPaloxItem.value,
  set: (val) => setCurrentPaloxItem(val),
});
const selectedPaloxType = computed({
  get: () => getSelectedPaloxType.value,
  set: (val) => setSelectedPaloxType(val),
});

const { data, isLoading, execute } = useDbFetch<
  DropdownSearchItem,
  typeof fetchPaloxTypes
>(fetchPaloxTypes);

watch(getActionErrorMessage, (newError) => {
  if (newError) presentToast(newError, "danger", 10000);
});

onMounted(async () => {
  resetStore();
  await execute(true);
  if (Array.isArray(data.value) && data.value.length > 0) {
    paloxExitStore.setSelectedPaloxType(data.value[0]);
  } else {
    presentToast(
      "Es wurde keinen Standardwert für die Paloxenart gefunden.",
      "warning"
    );
  }
});

async function handleNext() {
  const { success, parentReloadRequired, closeModal } = await nextStep();
  if (success) {
    if (closeModal) {
      const toastMessage = buildSuccessToastMessage();
      presentToast(toastMessage, "success", 6000);
      closeStepperModal(parentReloadRequired);
    }
  }
}

function buildSuccessToastMessage(): string {
  return `Die Paloxe ${getSelectedPaloxType.value?.display_name}-${getCurrentPaloxItem.value?.display_name} wurde erfolgreich ausgelagert.`;
}

function closeStepperModal(requiresReload: boolean) {
  modalController.dismiss(requiresReload);
}
</script>
