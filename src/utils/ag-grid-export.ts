import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ColDef, ValueFormatterParams } from "ag-grid-community";

function getNestedValue<T extends object>(row: T, field?: string): string {
  if (!field) return "";
  return (
    field
      .split(".")
      .reduce<any>((obj, key) => (obj ? obj[key] : undefined), row) ?? ""
  );
}

export function exportDataAsPDF<T extends object>(
  data: T[],
  columnDefs: ColDef<T, any>[],
  fileNamePrefix: string
) {
  const now = new Date();
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(
    `${fileNamePrefix}übersicht vom ${now.toLocaleString("de-CH")}`,
    14,
    20
  );

  const headers = columnDefs.map((col) => col.headerName ?? col.field ?? "");

  const body = data.map((row) =>
    columnDefs.map((col) => {
      const { field, valueFormatter } = col;
      const rawValue = field ? getNestedValue(row, field) : "";

      if (typeof valueFormatter === "function") {
        const params: Partial<ValueFormatterParams<T>> = {
          value: rawValue,
          data: row,
          colDef: col,
        };
        return valueFormatter(params as ValueFormatterParams<T>);
      }

      return rawValue;
    })
  );

  autoTable(doc, {
    head: [headers],
    body,
    startY: 30,
  });

  doc.save(
    `${fileNamePrefix}_${now.toLocaleString("de-CH", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    })}.pdf`
  );
}
