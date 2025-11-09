import type { DropdownSearchItem } from "./dropdown-search-item";
import { SearchType } from "./search-type";

export type ConditionalFetchMethod<T extends SearchType> =
  T extends SearchType.Numeric
    ? (term?: number) => Promise<DropdownSearchItem[]>
    : (term?: string) => Promise<DropdownSearchItem[]>;
