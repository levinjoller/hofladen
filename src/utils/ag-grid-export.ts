import type {
  ColDef,
  ValueFormatterParams,
  ValueGetterParams,
} from "ag-grid-community";
import type { TDocumentDefinitions } from "pdfmake/interfaces";

const getPdfMake = async () => {
  const [pdfMakeModule, { pdfVFS }] = await Promise.all([
    import("pdfmake/build/pdfmake"),
    import("@/assets/vfs_fonts"),
  ]);
  const pdfInstance = pdfMakeModule.default;
  pdfInstance.setFonts({
    NotoSans: {
      normal: "NotoSans.ttf",
      bold: "NotoSans.ttf",
    },
    NotoEmoji: {
      normal: "NotoEmoji.ttf",
    },
  });
  pdfInstance.addVirtualFileSystem(pdfVFS);
  return pdfInstance;
};

type ExportableValue = string | number | boolean | Date | null | undefined;

function getNestedValue<T extends object>(
  row: T,
  field?: string,
): ExportableValue {
  if (!field) return null;
  return field
    .split(".")
    .reduce<any>((obj, key) => (obj ? obj[key] : undefined), row);
}

function resolveColDefValue<T extends object>(
  col: ColDef<T>,
  row: T,
): ExportableValue {
  if (typeof col.valueGetter === "function") {
    return col.valueGetter({
      data: row,
      colDef: col,
    } as ValueGetterParams<T>);
  }
  if (!col.field) return null;
  const rawValue = getNestedValue(row, col.field);
  if (typeof col.valueFormatter === "function") {
    return col.valueFormatter({
      value: rawValue,
      data: row,
      colDef: col,
    } as ValueFormatterParams<T>);
  }
  return rawValue;
}

function normalizeForPdf(value: ExportableValue): string {
  if (value == null) return "";
  if (value instanceof Date) {
    return value.toLocaleDateString("de-CH");
  }
  return String(value);
}

function splitTextByEmoji(text: string) {
  const result: Array<{ text: string; font?: string }> = [];
  const emojiRegex = /\p{Emoji_Presentation}/gu;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = emojiRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push({ text: text.slice(lastIndex, match.index) });
    }
    result.push({ text: match[0], font: "NotoEmoji" });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    result.push({ text: text.slice(lastIndex) });
  }
  return result;
}

export async function exportDataAsPDF<T extends object>(
  data: T[],
  columnDefs: ColDef<T>[],
  fileNamePrefix: string,
) {
  const pdfMake = await getPdfMake();
  const now = new Date();
  const headers = columnDefs.map((col) => ({
    text: col.headerName ?? (typeof col.field === "string" ? col.field : ""),
    style: "tableHeader",
  }));
  const body = data.map((row) =>
    columnDefs.map((col) => ({
      text: splitTextByEmoji(normalizeForPdf(resolveColDefValue(col, row))),
      noWrap: false,
    })),
  );
  const docDefinition: TDocumentDefinitions = {
    defaultStyle: {
      font: "NotoSans",
      fontSize: 10,
    },
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
      tableHeader: {
        bold: true,
        fillColor: "#eeeeee",
        alignment: "center",
      },
    },
  };
  pdfMake
    .createPdf(docDefinition)
    .download(
      `${fileNamePrefix}_${now
        .toLocaleDateString("de-CH")
        .replace(/\./g, "-")}.pdf`,
    );
}
