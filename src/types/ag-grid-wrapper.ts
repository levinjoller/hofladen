import { ColDef, GridApi } from "ag-grid-community";

export type AgGridWrapperExposed<T> = {
  getApi: () => GridApi<T> | null;
};

export interface ComponentMap {
  [key: string]: any;
}

export interface AgGridWrapperProps<T> {
  rowData: T[];
  columnDefs: ColDef<T>[];
  isParentLoading?: boolean;
  customComponents?: ComponentMap;
}
