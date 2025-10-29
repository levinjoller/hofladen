import {
  DropdownSearchItem,
  DropdownSearchItemSchema,
} from "@/types/dropdown-search-item";
import { StockStoreState } from "@/types/stores/stock-state";
import { defineStore } from "pinia";

const getInitialState = (): StockStoreState => ({
  _currentStockItem: null,
});

export const useStockStore = defineStore("stockStore", {
  state: () => getInitialState(),
  getters: {
    getCurrentStockItem(state): DropdownSearchItem | null {
      return state._currentStockItem;
    },
  },
  actions: {
    setCurrentStockItem(item: DropdownSearchItem | null) {
      if (!item) {
        this._currentStockItem = null;
        return;
      }
      const validationResult = DropdownSearchItemSchema.safeParse(item);
      if (validationResult.success) {
        this._currentStockItem = validationResult.data;
      } else {
        throw validationResult.error;
      }
    },
  },
  persist: true,
});
