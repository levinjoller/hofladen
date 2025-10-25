import { KnownError } from "@/types/errors";
import { isPostgrestError, isZodError } from "./type-guards";

export function getUserFriendlyErrorMessage(err: KnownError): string {
  const defaultMessage =
    "Es ist ein unbekannter Fehler aufgetreten. Bitte versuchen Sie es später erneut.";

  if (isZodError(err)) {
    const zodErrorMessage = err.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join(", ");
    return `Ungültiges Datenformat: ${zodErrorMessage}`;
  }

  if (isPostgrestError(err)) {
    const map: Record<string, string> = {
      YY001: "Der angegebene Paloxentyp wurde nicht gefunden.",
      YY002: "Das angegebene Produkt wurde nicht gefunden.",
      YY003: "Der angegebene Lieferant wurde nicht gefunden.",
      YY004: "Der angegebene Kunde wurde nicht gefunden.",
      YY005: "Diese Paloxe ist bereits in einem Lagerplatz.",
      YY006: "Kein freier Lagerplatz für diese Position gefunden.",
      YY007: "Die angegebene Lagerplatz-Ebene wurde nicht gefunden.",
    };
    if (err.hint) console.debug("DB-Hint:", err.hint);
    return map[err.code] || defaultMessage;
  }

  return err.message || defaultMessage;
}
