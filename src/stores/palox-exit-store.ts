import { useDbAction } from "@/composables/use-db-action";
import { removePaloxFromStock } from "@/services/palox-exit-service";
import {
  DropdownSearchItem,
  DropdownSearchItemSchema,
} from "@/types/dropdown-search-item";
import { StepResult } from "@/types/step-result";
import { PaloxExitState } from "@/types/stores/palox-exit-state";
import {
  createFinalStepChecker,
  FAILED_PRECHECK_RESULT,
} from "@/utils/strategy-helper";
import { defineStore } from "pinia";
import { computed, reactive, toRefs } from "vue";

const FINAL_STEP = 1;

const getInitialState = (): PaloxExitState => ({
  currentStep: 1,
  _currentPaloxItem: null,
  _selectedPaloxType: null,
  _isActionLoading: false,
  actionErrorMessage: null,
});

export const usePaloxExitStore = defineStore("paloxExitStore", () => {
  const state = reactive(getInitialState());
  const { execute: removePaloxExecute } = useDbAction(
    removePaloxFromStock,
    (loading, error) => {
      state._isActionLoading = loading;
      state.actionErrorMessage = error;
    }
  );
  const getCurrentPaloxItem = computed(() => state._currentPaloxItem);
  const getSelectedPaloxType = computed(() => state._selectedPaloxType);
  const isActionLoading = computed(() => state._isActionLoading);
  const getActionErrorMessage = computed(() => state.actionErrorMessage);
  const isFinalStep = computed(() =>
    createFinalStepChecker(FINAL_STEP)(state.currentStep)
  );
  const canProceed = computed(
    () => !!state._currentPaloxItem && !!state._selectedPaloxType
  );

  function resetStore() {
    Object.assign(state, getInitialState());
  }

  function setCurrentPaloxItem(item: DropdownSearchItem | null) {
    if (!item) {
      state._currentPaloxItem = null;
      return;
    }
    const result = DropdownSearchItemSchema.safeParse(item);
    if (!result.success) throw result.error;
    state._currentPaloxItem = result.data;
  }

  function setSelectedPaloxType(item: DropdownSearchItem | null) {
    state._currentPaloxItem = null;
    if (!item) {
      state._selectedPaloxType = null;
      return;
    }
    const result = DropdownSearchItemSchema.safeParse(item);
    if (!result.success) throw result.error;
    state._selectedPaloxType = result.data;
  }

  async function executeFinalAction(paloxId: number) {
    await removePaloxExecute({ p_palox_id: paloxId });
    return !state.actionErrorMessage;
  }

  async function nextStep(): Promise<StepResult> {
    if (!canProceed.value || !state._currentPaloxItem)
      return FAILED_PRECHECK_RESULT;
    if (isFinalStep.value) {
      const success = await executeFinalAction(state._currentPaloxItem.id);
      return {
        success,
        parentReloadRequired: success,
        closeModal: success,
        isCompleted: true,
      };
    }
    state.currentStep++;
    return {
      success: true,
      parentReloadRequired: false,
      closeModal: false,
      isCompleted: false,
    };
  }

  function prevStep() {
    if (state.currentStep > 1) state.currentStep--;
  }

  return {
    ...toRefs(state),
    isActionLoading,
    getCurrentPaloxItem,
    getActionErrorMessage,
    getSelectedPaloxType,
    isFinalStep,
    canProceed,
    setCurrentPaloxItem,
    setSelectedPaloxType,
    nextStep,
    prevStep,
    executeFinalAction,
    resetStore,
  };
});
