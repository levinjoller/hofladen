import { defineStore } from "pinia";
import { assignPaloxToSlot } from "@/services/palox-create-service";
import { PaloxStoreState } from "@/types/stores/palox-state";
import { useDbAction } from "@/composables/use-db-action";
import { SlotContent } from "@/types/schemas/slot-content-schema";
import { StepResult } from "@/types/step-result";
import { FAILED_PRECHECK_RESULT } from "@/utils/strategy-helper";
import { DropdownSearchItem } from "@/types/dropdown-search-item";

const getInitialState = (): PaloxStoreState => ({
  currentStep: 1,
  selectedPaloxType: null,
  selectedPaloxNumber: null,
  selectedSupplier: null,
  selectedCustomer: null,
  selectedProduct: null,
  selectedStock: null,
  selectedStockColumnSlot: null,
  _isActionLoading: false,
  actionErrorMessage: null as string | null,
});

export const usePaloxStore = defineStore("paloxIntoStock", {
  state: () => getInitialState(),

  getters: {
    isActionLoading(): boolean {
      return this._isActionLoading;
    },
    getActionErrorMessage(): string | null {
      return this.actionErrorMessage;
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
        default:
          return false;
      }
    },
  },
  actions: {
    setSelectedSlot(slot: SlotContent | null) {
      this.selectedStockColumnSlot = slot;
    },
    setSelectedPaloxType(paloxType: DropdownSearchItem | null) {
      this.selectedPaloxType = paloxType;
    },
    setActionStatus(isLoading: boolean, errorMessage: string | null) {
      this._isActionLoading = isLoading;
      this.actionErrorMessage = errorMessage;
    },
    initializeState(currentStock: DropdownSearchItem | null) {
      this.$reset();
      if (currentStock) {
        this.selectedStock = currentStock;
      }
    },
    async nextStep(): Promise<StepResult> {
      if (!this.canProceed) {
        return FAILED_PRECHECK_RESULT;
      }
      if (this.currentStep < 2) {
        this.currentStep++;
        return {
          success: true,
          parentReloadRequired: false,
          closeModal: false,
          isCompleted: false,
        };
      }
      const { execute } = useDbAction(assignPaloxToSlot, (loading, error) =>
        this.setActionStatus(loading, error)
      );
      await execute({
        paloxTypeId: this.selectedPaloxType!.id,
        paloxNumber: this.selectedPaloxNumber!,
        stockColumnSlotId: this.selectedStockColumnSlot!.slot_id,
        productId: this.selectedProduct!.id,
        supplierId: this.selectedSupplier!.id,
        customerId: this.selectedCustomer?.id,
      });
      const success = !this.actionErrorMessage;
      return {
        success: success,
        parentReloadRequired: success,
        closeModal: success,
        isCompleted: true,
      };
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
  },
});
