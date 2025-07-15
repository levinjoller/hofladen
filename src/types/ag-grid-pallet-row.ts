export interface AgGridPalletRow {
  pallet_id: number;
  created_at: string;
  customer_name: string | null;
  supplier_name: string | null;
  product_name: string | null;
  stock_column_row_level: string | null;
}
