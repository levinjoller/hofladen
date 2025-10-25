import { defineStore } from "pinia";
import { assignPaloxToSlot } from "@/services/palox-create-service";
import { PaloxStoreState } from "@/types/stores/palox-state";
import { useDbAction } from "@/composables/use-db-action";

const { errorMessage, isLoading, execute } = useDbAction(assignPaloxToSlot);

const getInitialState = (): PaloxStoreState => ({
  currentStep: 1,
  selectedPaloxType: null,
  selectedPaloxNumber: null,
  selectedSupplier: null,
  selectedCustomer: null,
  selectedProduct: null,
  selectedStock: null,
  selectedStockColumnSlot: null,
});

export const usePaloxStore = defineStore("paloxIntoStock", {
  state: () => getInitialState(),

  getters: {
    isActionLoading(): boolean {
      return isLoading.value;
    },
    actionErrorMessage(): string | null {
      return errorMessage.value;
    },
    canProceed(state) {
      switch (state.currentStep) {
        case 1:
          return Boolean(
            state.selectedPaloxType &&
              state.selectedPaloxNumber &&
              state.selectedSupplier &&
              state.selectedProduct &&
              state.selectedStock
          );
        case 2:
          return Boolean(state.selectedStockColumnSlot);
        case 3:
          return true;
        default:
          return false;
      }
    },
    shouldCloseModal(state) {
      return state.selectedStockColumnSlot?.current_taken_levels === 0;
    },
  },

  actions: {
    async submitStepTwo() {
      return await execute({
        paloxTypeId: this.selectedPaloxType!.id,
        paloxNumber: this.selectedPaloxNumber,
        stockColumnSlotId: this.selectedStockColumnSlot!.slot_id,
        productId: this.selectedProduct!.id,
        supplierId: this.selectedSupplier!.id,
        customerId: this.selectedCustomer?.id,
      });
    },
    async nextStep() {
      if (!this.canProceed) {
        return { success: false, showSuccessToast: false, closeModal: false };
      }
      if (this.currentStep === 2) {
        const success = await this.submitStepTwo();
        if (success && !this.shouldCloseModal) {
          this.currentStep++;
        }
        return {
          success,
          showSuccessToast: success,
          closeModal: this.shouldCloseModal,
        };
      }
      this.currentStep++;
      return { success: true, showSuccessToast: false, closeModal: false };
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
  },
});
