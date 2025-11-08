import { isPostgrestError, isZodError } from "./type-guards";

export function getUserFriendlyErrorMessage(err: unknown): string {
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
      YY008: "Mindestens eine Paloxe war zuvor nicht in einem der Lagerplätze.",
      YY009: "Die maximale Stapelhöhe ist nicht gesetzt oder nicht auffindbar.",
      YY010: "Die maximale Stapelhöhe wurde überschritten.",
      YY011: "Es dürfen nur genau zwei Lagerplätze angegeben werden.",
      YY012: "Einer der angegebenen Lagerplätze wurde nicht gefunden.",
      YY013:
        "Der angegebene Lagerplatz konnte nicht alle zugewiesenen Paloxen aufnehmen.",
    };
    if (err.hint) console.debug("DB-Hint:", err.hint);
    return map[err.code] || defaultMessage;
  }

  if (err instanceof Error) {
    return err.message || defaultMessage;
  }

  return defaultMessage;
}
