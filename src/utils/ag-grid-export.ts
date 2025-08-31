import pdfMake from "pdfmake/build/pdfmake";
import { pdfVFS } from "@/assets/vfs_fonts";
import type {
  ColDef,
  ValueFormatterParams,
  ValueGetterParams,
} from "ag-grid-community";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { PaloxesInStockView } from "@/types/generated/views/paloxes-in-stock-view";

const loadFonts = async () => {
  const { pdfVFS } = await import("@/assets/vfs_fonts");

  const FONTS = {
    NotoSans: {
      normal: "NotoSans.ttf",
      bold: "NotoSans.ttf",
    },
    NotoEmoji: {
      normal: "NotoEmoji.ttf",
    },
  };

  pdfMake.vfs = pdfVFS;
  pdfMake.fonts = FONTS;
};

function getNestedValue<T extends object>(row: T, field?: string) {
  if (!field) return "";
  return (
    field
      .split(".")
      .reduce<any>((obj, key) => (obj ? obj[key] : undefined), row) ?? ""
  );
}

function splitTextByEmoji(text: string) {
  const result: Array<{ text: string; font?: string }> = [];
  const emojiRegex = /[\u{1F300}-\u{1F6FF}]/gu;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = emojiRegex.exec(text)) !== null) {
    if (match.index > lastIndex)
      result.push({ text: text.slice(lastIndex, match.index) });
    result.push({ text: match[0], font: "NotoEmoji" });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) result.push({ text: text.slice(lastIndex) });
  return result;
}

export async function exportDataAsPDF(
  data: PaloxesInStockView[],
  columnDefs: ColDef<PaloxesInStockView>[],
  fileNamePrefix: string
) {
  await loadFonts();
  const now = new Date();
  const headers = columnDefs.map((col) => ({
    text: col.headerName ?? col.field ?? "",
    style: "tableHeader",
  }));

  const body = data.map((row) =>
    columnDefs.map((col) => {
      let cellValue: string;
      if (typeof col.valueGetter === "function") {
        cellValue =
          col.valueGetter({
            data: row,
            colDef: col,
          } as ValueGetterParams<PaloxesInStockView>) ?? "";
      } else {
        const rawValue = col.field ? getNestedValue(row, col.field) : "";
        cellValue =
          typeof col.valueFormatter === "function"
            ? col.valueFormatter({
                value: rawValue,
                data: row,
                colDef: col,
              } as ValueFormatterParams<PaloxesInStockView>) ?? ""
            : rawValue ?? "";
      }
      return { text: splitTextByEmoji(cellValue), noWrap: false };
    })
  );

  const docDefinition: TDocumentDefinitions = {
    defaultStyle: { fontSize: 10, font: "NotoSans" },
    content: [
      {
        text: `${fileNamePrefix}übersicht vom ${now.toLocaleString("de-CH")}`,
        fontSize: 16,
        margin: [0, 0, 0, 10],
      },
      {
        table: {
          headerRows: 1,
          widths: Array(headers.length).fill("*"),
          body: [headers, ...body],
          dontBreakRows: true,
        },
      },
    ],
    styles: {
      tableHeader: { bold: true, fillColor: "#eeeeee", alignment: "center" },
    },
  };

  pdfMake
    .createPdf(docDefinition)
    .download(
      `${fileNamePrefix}_${now
        .toLocaleDateString("de-CH")
        .replace(/\./g, "-")}.pdf`
    );
}
