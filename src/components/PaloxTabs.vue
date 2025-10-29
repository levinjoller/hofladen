<template>
  <ion-footer>
    <ion-toolbar>
      <div class="equal-spacing">
        <ion-chip @click="openStockModal()">
          <ion-icon :icon="homeOutline"></ion-icon>
          <ion-label>{{
            stockStore.getCurrentStockItem?.display_name || "-"
          }}</ion-label>
        </ion-chip>
        <div
          class="ion-activatable ripple-parent"
          @click="openPaloxIntoStockStepperModal"
        >
          <ion-icon :src="IconBox" size="large" />
          <ion-ripple-effect></ion-ripple-effect>
        </div>

        <div class="ion-activatable ripple-parent" @click="openPaloxSortModal">
          <ion-icon :src="IconSortAscending" size="large" />
          <ion-ripple-effect></ion-ripple-effect>
        </div>

        <div class="ion-activatable ripple-parent" @click="openPaloxMoveModal">
          <ion-icon :src="IconReorder" size="large" />
          <ion-ripple-effect></ion-ripple-effect>
        </div>

        <div class="ion-activatable ripple-parent" @click="openPaloxSwapModal">
          <ion-icon :src="IconReplace" size="large" />
          <ion-ripple-effect></ion-ripple-effect>
        </div>
        <div class="ion-activatable ripple-parent" @click="openPaloxExitModal">
          <ion-icon :src="IconBoxOff" size="large" />
          <ion-ripple-effect></ion-ripple-effect>
        </div>
      </div>
    </ion-toolbar>
  </ion-footer>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { modalController } from "@ionic/vue";
import { usePaloxStore } from "@/stores/palox-store";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import IconBoxOff from "@/assets/icons/IconBoxOff.svg";
import IconReplace from "@/assets/icons/IconReplace.svg";
import IconBox from "@/assets/icons/IconBox.svg";
import IconSortAscending from "@/assets/icons/IconSortAscending.svg";
import IconReorder from "@/assets/icons/IconReorder.svg";
import { homeOutline } from "ionicons/icons";
import {
  IonFooter,
  IonToolbar,
  IonIcon,
  IonRippleEffect,
  IonChip,
  IonLabel,
} from "@ionic/vue";
import { useStockStore } from "@/stores/stock-store";
import { fetchStocks } from "@/services/palox-create-service";
import { DropdownSearchItem } from "@/types/dropdown-search-item";
import { presentToast } from "@/services/toast-service";
import { getUserFriendlyErrorMessage } from "@/utils/get-user-friendly-error-message";

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

const openStockModal = async () => {
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
  if (selectedStock) {
    try {
      stockStore.setCurrentStockItem(selectedStock);
    } catch (error: unknown) {
      presentToast(getUserFriendlyErrorMessage(error), "danger", 10000);
    }
  }
};

const openPaloxSortModal = () => {};
const openPaloxSwapModal = () => {};
const openPaloxMoveModal = () => {};
const openPaloxExitModal = () => {};

const emit = defineEmits<{
  (e: "refetch-parent-data"): void;
}>();

const openPaloxIntoStockStepperModal = async () => {
  paloxStore.$reset();
  const modal = await modalController.create({
    component: PaloxIntoStockStepperAsyncModal,
  });
  await modal.present();
  const { data: requiresReload } = await modal.onDidDismiss<Boolean>();
  if (requiresReload) {
    emit("refetch-parent-data");
  }
};
</script>

<style scoped>
.equal-spacing {
  display: flex;
  justify-content: space-around;
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
  background: transparent;
  border-radius: 0;
}
</style>
