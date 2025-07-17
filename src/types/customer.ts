import { Person } from "./person";

export interface Customer {
  id: number;
  created_at: string;
  fk_person: number;
  person?: Person;
}
