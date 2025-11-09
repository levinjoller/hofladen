import { SearchType } from "@/types/search-type";

export function getSearchTermValue(
  raw: string,
  searchType: SearchType | undefined,
  effectiveMinLength: number
): string | number | null {
  const effectiveSearchType = searchType ?? SearchType.Text;
  if (effectiveSearchType === SearchType.Numeric) {
    // alle Nicht-Ziffern entfernen
    const digits = raw.replace(/\D/g, "");
    if (digits.length === 0) return null;
    return parseInt(digits, 10);
  }
  if (effectiveSearchType === SearchType.Text) {
    const trimmed = raw.trim();
    if (trimmed.length >= effectiveMinLength) return trimmed;
  }
  return null;
}
