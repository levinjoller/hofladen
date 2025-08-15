import { ValueFormatterParams } from "ag-grid-community";

export function toLocaleDate(params: ValueFormatterParams): string {
  if (!params.value) {
    return "";
  }

  const date = new Date(params.value);

  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
