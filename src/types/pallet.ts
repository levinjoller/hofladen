// src/types/pallet.ts (oder wo auch immer Sie Ihre Typen definieren)

export interface Pallet {
  id: number;
  created_at: string;
  updated_at: string;
  product: {
    display_name: string;
  } | null;
  customer: {
    person: {
      display_name: string;
    };
  } | null;
  supplier: {
    person: {
      display_name: string;
    };
  } | null;
  stock_column_slot_level: {
    display_name: string;
    stock_column_slot: {
      display_name: string;
      stock_column: {
        display_name: string;
        stock: {
          display_name: string;
        };
      };
    };
  } | null;
}
