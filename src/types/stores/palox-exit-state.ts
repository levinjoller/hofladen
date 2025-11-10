import { DropdownSearchItem } from "@/types/dropdown-search-item";

export interface PaloxExitState {
  currentStep: number;
  _currentPaloxItem: DropdownSearchItem | null;
  _selectedPaloxType: DropdownSearchItem | null;
  _isActionLoading: boolean;
  actionErrorMessage: string | null;
}
