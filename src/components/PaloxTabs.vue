<template>
  <IonFooter>
    <IonToolbar>
      <div class="toolbar-content">
        <IonChip
          @click="openStockModal"
          @contextmenu.prevent="presentPopover"
          @pointerdown.stop
          @mousedown.stop
          @touchstart.stop
        >
          <IonIcon :icon="homeOutline" />
          <IonLabel>{{ currentStockName }}</IonLabel>
        </IonChip>

        <template v-for="action in actions" :key="action.label">
          <div
            class="ion-activatable ripple-parent"
            @click="action.handler"
            :aria-label="action.label"
          >
            <IonIcon :src="action.icon" size="large" />
            <IonRippleEffect />
          </div>
        </template>
      </div>
    </IonToolbar>
  </IonFooter>

  <IonPopover
    :is-open="isPopoverOpen"
    :event="popoverEvent"
    @did-dismiss="closePopover"
    :keep-contents-mounted="true"
  >
    <IonContent class="ion-padding">
      <p>Standardlager zurücksetzen?</p>
      <div class="popover-buttons">
        <IonButton
          color="medium"
          fill="outline"
          expand="block"
          @click="closePopover"
        >
          Nein
        </IonButton>
        <IonButton color="primary" expand="block" @click="resetStockStore">
          Ja
        </IonButton>
      </div>
    </IonContent>
  </IonPopover>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, computed } from "vue";
import { modalController } from "@ionic/vue";
import { homeOutline } from "ionicons/icons";
import {
  IonFooter,
  IonToolbar,
  IonChip,
  IonIcon,
  IonLabel,
  IonRippleEffect,
  IonPopover,
  IonContent,
  IonButton,
} from "@ionic/vue";

import { usePaloxStore } from "@/stores/palox-store";
import { useStockStore } from "@/stores/stock-store";
import { fetchStocks } from "@/services/palox-create-service";
import { DropdownSearchItem } from "@/types/dropdown-search-item";
import { presentToast } from "@/services/toast-service";
import { getUserFriendlyErrorMessage } from "@/utils/get-user-friendly-error-message";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

import IconBox from "@/assets/icons/IconBox.svg";
import IconBoxOff from "@/assets/icons/IconBoxOff.svg";
import IconReplace from "@/assets/icons/IconReplace.svg";
import IconSortAscending from "@/assets/icons/IconSortAscending.svg";
import IconReorder from "@/assets/icons/IconReorder.svg";

const DropdownSearchAsyncModal = defineAsyncComponent({
  loader: () => import("@/components/DropdownSearchModal.vue"),
  loadingComponent: LoadingSpinner,
  delay: 200,
});

const PaloxIntoStockStepperAsyncModal = defineAsyncComponent({
  loader: () => import("@/components/PaloxIntoStockStepperModal.vue"),
  loadingComponent: LoadingSpinner,
  delay: 200,
});

const paloxStore = usePaloxStore();
const stockStore = useStockStore();

const isPopoverOpen = ref(false);
const popoverEvent = ref<Event | null>(null);

const currentStockName = computed(
  () => stockStore.getCurrentStockItem?.display_name || "-"
);

const emit = defineEmits<{ (e: "refetch-parent-data"): void }>();

function closePopover() {
  isPopoverOpen.value = false;
}

function presentPopover(event: Event) {
  event.preventDefault();
  popoverEvent.value = event;
  isPopoverOpen.value = true;
}

function resetStockStore() {
  stockStore.$reset();
  closePopover();
  presentToast("Standardlager erfolgreich zurückgesetzt.", "success", 3000);
}

async function openStockModal() {
  const modal = await modalController.create({
    component: DropdownSearchAsyncModal,
    componentProps: {
      title: "Standardlager",
      fetchMethod: fetchStocks,
      isSearchable: false,
      searchType: "numeric",
    },
  });
  await modal.present();

  const { data: selectedStock } =
    await modal.onDidDismiss<DropdownSearchItem>();
  if (!selectedStock) return;

  try {
    stockStore.setCurrentStockItem(selectedStock);
  } catch (error) {
    presentToast(getUserFriendlyErrorMessage(error), "danger", 10000);
  }
}

async function openPaloxIntoStockStepperModal() {
  paloxStore.$reset();
  const modal = await modalController.create({
    component: PaloxIntoStockStepperAsyncModal,
  });
  await modal.present();

  const { data: requiresReload } = await modal.onDidDismiss<boolean>();
  if (requiresReload) emit("refetch-parent-data");
}

function openPaloxSortModal() {}
function openPaloxSwapModal() {}
function openPaloxMoveModal() {}
function openPaloxExitModal() {}

const actions = [
  {
    label: "Einlagern",
    icon: IconBox,
    handler: openPaloxIntoStockStepperModal,
  },
  { label: "Sortieren", icon: IconSortAscending, handler: openPaloxSortModal },
  { label: "Verschieben", icon: IconReorder, handler: openPaloxMoveModal },
  { label: "Tauschen", icon: IconReplace, handler: openPaloxSwapModal },
  { label: "Auslagern", icon: IconBoxOff, handler: openPaloxExitModal },
];
</script>

<style scoped>
.toolbar-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.ripple-parent {
  position: relative;
  overflow: hidden;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  cursor: pointer;
}

.popover-buttons {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;
}
</style>
