<template>
  <IonFooter>
    <IonToolbar>
      <div class="toolbar-content">
        <IonChip
          @click="openStockModal"
          @contextmenu.prevent="togglePopover"
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
          >Nein</IonButton
        >
        <IonButton color="primary" expand="block" @click="resetStockStore"
          >Ja</IonButton
        >
      </div>
    </IonContent>
  </IonPopover>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from "vue";
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

import { ModiConstants, type Modi } from "@/types/modi";
import { useSlotStrategy } from "@/composables/use-slot-strategy";

const emit = defineEmits<{ (e: "refetch-parent-data"): void }>();
const paloxStore = usePaloxStore();
const stockStore = useStockStore();

const isPopoverOpen = ref(false);
const popoverEvent = ref<Event | null>(null);

const currentStockName = computed(
  () => stockStore.getCurrentStockItem?.display_name || "-"
);

function createAsyncModal(loader: () => Promise<any>) {
  return defineAsyncComponent({
    loader,
    loadingComponent: LoadingSpinner,
    delay: 200,
  });
}

const DropdownSearchAsyncModal = createAsyncModal(
  () => import("@/components/DropdownSearchModal.vue")
);
const PaloxIntoStockStepperAsyncModal = createAsyncModal(
  () => import("@/components/PaloxIntoStockStepperModal.vue")
);
const SlotSortAsyncModal = createAsyncModal(
  () => import("@/components/SlotSortModal.vue")
);

async function openModal<T>(
  component: any,
  componentProps: Record<string, unknown>
): Promise<T | undefined> {
  const modal = await modalController.create({ component, componentProps });
  await modal.present();
  const { data } = await modal.onDidDismiss<T>();
  return data;
}

function togglePopover(event?: Event) {
  if (event) event.preventDefault();
  isPopoverOpen.value = !isPopoverOpen.value;
  popoverEvent.value = event || null;
}

function closePopover() {
  isPopoverOpen.value = false;
}

function resetStockStore() {
  stockStore.$reset();
  closePopover();
  presentToast("Standardlager erfolgreich zurückgesetzt.", "success", 3000);
}

async function openStockModal() {
  const selectedStock = await openModal<DropdownSearchItem>(
    DropdownSearchAsyncModal,
    {
      title: "Standardlager",
      fetchMethod: fetchStocks,
      isSearchable: false,
      searchType: "numeric",
    }
  );
  if (!selectedStock) return;
  try {
    stockStore.setCurrentStockItem(selectedStock);
  } catch (error) {
    presentToast(getUserFriendlyErrorMessage(error), "danger", 10000);
  }
}

async function openPaloxIntoStockStepperModal() {
  const currentModi = ref<Modi>(ModiConstants.INSERT);
  const activeStrategy = useSlotStrategy(currentModi);
  paloxStore.$reset();
  const requiresReload = await openModal<boolean>(
    PaloxIntoStockStepperAsyncModal,
    { activeStrategy: activeStrategy.value }
  );
  if (requiresReload) emit("refetch-parent-data");
}

async function openSlotSortModal(modi: Modi = ModiConstants.REORDER) {
  const currentModi = ref<Modi>(modi);
  const activeStrategy = useSlotStrategy(currentModi);
  const requiresReload = await openModal<boolean>(SlotSortAsyncModal, {
    title: "Paloxenstapel sortieren",
    currentStock: stockStore.getCurrentStockItem,
    activeStrategy: activeStrategy.value,
  });
  if (requiresReload) emit("refetch-parent-data");
}

const openPaloxMoveModal = () => openSlotSortModal(ModiConstants.MOVE);
const openPaloxSwapModal = () => openSlotSortModal(ModiConstants.SWAP);
const openPaloxExitModal = () => {};

const actions = [
  {
    label: "Einlagern",
    icon: IconBox,
    handler: openPaloxIntoStockStepperModal,
  },
  {
    label: "Sortieren",
    icon: IconSortAscending,
    handler: () => openSlotSortModal(ModiConstants.REORDER),
  },
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
