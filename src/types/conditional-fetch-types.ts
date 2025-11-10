import type { DropdownSearchItem } from "./dropdown-search-item";
import { SearchType } from "./search-type";

type NullaryFetch = () => Promise<DropdownSearchItem[]>;

export type ConditionalFetchMethod<T extends SearchType> =
  | NullaryFetch
  | (T extends SearchType.Numeric
      ? (term?: number) => Promise<DropdownSearchItem[]>
      : (term?: string) => Promise<DropdownSearchItem[]>);
