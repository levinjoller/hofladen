import { defineStore } from "pinia";
import type { SlotReorderState } from "@/types/stores/slot-reorder-state";
import type { SlotPaloxOrderData } from "@/types/slot-palox-order-data";
import type { SlotSelectionStrategy } from "@/types/slot-selection-strategy";
import type { DropdownSearchItem } from "@/types/dropdown-search-item";
import { StepResult } from "@/types/step-result";
import { findSlotOrder, upsertSlotOrder } from "@/utils/db-payload-helper";
import { arraysEqual, FAILED_PRECHECK_RESULT } from "@/utils/strategy-helper";

const getInitialState = (): SlotReorderState => ({
  currentStep: 1,
  selectedStrategy: null,
  selectedStock: null,
  selectedStockColumnSlot: [],
  originalOrder: [],
  newOrder: [],
  _isActionLoading: false,
  actionErrorMessage: null as string | null,
});

export const useSlotReorderStore = defineStore("slotReorderStore", {
  state: (): SlotReorderState => getInitialState(),
  getters: {
    isActionLoading(): boolean {
      return this._isActionLoading;
    },
    getActionErrorMessage(): string | null {
      return this.actionErrorMessage;
    },
    isFinalStep(): boolean {
      if (!this.selectedStrategy) return false;
      return this.selectedStrategy.isFinalStep(this.currentStep);
    },
    canProceed(state): boolean {
      if (!state.selectedStrategy || state.currentStep === 1)
        return Boolean(state.selectedStock);
      if (state.currentStep === 2)
        return state.selectedStrategy.canProceed(state.selectedStockColumnSlot);
      return true;
    },
    hasChanges(state): boolean {
      return state.newOrder.some((newSlotOrder) => {
        const original = findSlotOrder(
          state.originalOrder,
          newSlotOrder.slotId
        );
        if (!original) return true;
        return !arraysEqual(original.paloxIds, newSlotOrder.paloxIds);
      });
    },
  },
  actions: {
    initializeState(
      currentStock: DropdownSearchItem | null,
      activeStrategy: SlotSelectionStrategy
    ) {
      this.$reset();
      this.selectedStrategy = activeStrategy;
      if (currentStock) {
        this.selectedStock = currentStock;
        this.currentStep = 2;
      }
    },
    setReorderedPaloxes(slotId: number, paloxIds: number[]) {
      this.newOrder = upsertSlotOrder(this.newOrder, slotId, paloxIds);
    },
    setOriginalOrder(slotData: SlotPaloxOrderData[]) {
      this.originalOrder = slotData.map((item) => ({
        slotId: item.slotId,
        paloxIds: [...item.paloxIds],
      }));
    },
    setStrategyActionStatus(isLoading: boolean, errorMessage: string | null) {
      this._isActionLoading = isLoading;
      this.actionErrorMessage = errorMessage;
    },
    async nextStep(): Promise<StepResult> {
      if (!this.selectedStrategy || !this.canProceed) {
        return FAILED_PRECHECK_RESULT;
      }
      if (this.selectedStrategy.isFinalStep(this.currentStep)) {
        const { executeFinalAction } = this.selectedStrategy;
        if (executeFinalAction) {
          return await executeFinalAction(this);
        }
        return FAILED_PRECHECK_RESULT;
      }

      this.currentStep++;
      return {
        success: true,
        parentReloadRequired: false,
        closeModal: false,
        isCompleted: false,
      };
    },
    prevStep() {
      if (this.currentStep > 1) this.currentStep--;
    },
  },
});
