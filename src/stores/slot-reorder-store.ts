import { defineStore } from "pinia";
import { movePaloxesToDifferentLevel } from "@/services/palox-service";
import { useDbAction } from "@/composables/use-db-action";
import type { SlotReorderState } from "@/types/stores/slot-reorder-state";
import type { SlotPaloxOrderData } from "@/types/slot-palox-order-data";
import type { DbSlotPaloxOrderData } from "@/types/db-slot-palox-order-data";
import type { SlotSelectionStrategy } from "@/types/slot-selection-strategy";
import type { DropdownSearchItem } from "@/types/dropdown-search-item";
import { StepResult } from "@/types/step-result";

const {
  errorMessage: dbActionErrorMessage,
  isLoading: dbActionIsLoading,
  execute: dbActionExecute,
} = useDbAction(movePaloxesToDifferentLevel);

const getInitialState = (): SlotReorderState => ({
  currentStep: 1,
  selectedStrategy: null,
  selectedStock: null,
  selectedStockColumnSlot: [],
  originalOrder: [],
  newOrder: [],
});

function findSlotOrder(
  orderArray: SlotPaloxOrderData[],
  slotId: number
): SlotPaloxOrderData | undefined {
  return orderArray.find((item) => item.slotId === slotId);
}

function upsertSlotOrder(
  orderArray: SlotPaloxOrderData[],
  slotId: number,
  paloxIds: number[]
): SlotPaloxOrderData[] {
  const existing = orderArray.find((item) => item.slotId === slotId);
  if (existing) {
    existing.paloxIds = [...paloxIds];
  } else {
    orderArray.push({ slotId, paloxIds: [...paloxIds] });
  }
  return orderArray;
}

function arraysEqual(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}

export const useSlotReorderStore = defineStore("slotReorderStore", {
  state: (): SlotReorderState => getInitialState(),
  getters: {
    isActionLoading(): boolean {
      return dbActionIsLoading.value;
    },
    actionErrorMessage(): string | null {
      return dbActionErrorMessage.value;
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
    async submitStepTwo(): Promise<boolean> {
      if (!this.newOrder.length) return false;
      const dbPayloadArray: DbSlotPaloxOrderData[] = this.newOrder.map(
        (item) => ({
          slot_id: item.slotId,
          ordered_palox_ids: item.paloxIds,
        })
      );
      const payload = { p_slot_orders: dbPayloadArray };
      return await dbActionExecute(payload);
    },
    async nextStep(): Promise<StepResult> {
      if (!this.canProceed) {
        return {
          success: false,
          parentReloadRequired: false,
          closeModal: false,
          isCompleted: false,
        };
      }
      const isFinalStep = this.currentStep >= 3;
      if (isFinalStep) {
        if (!this.newOrder.length) {
          return {
            success: true,
            parentReloadRequired: false,
            closeModal: true,
            isCompleted: true,
          };
        }
        const success = await this.submitStepTwo();
        return {
          success,
          parentReloadRequired: success,
          closeModal: true,
          isCompleted: true,
        };
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
