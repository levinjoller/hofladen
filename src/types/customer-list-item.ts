export type CustomerListItem = {
  id: number;
  created_at: string;
  person: {
    display_name: string;
  } | null;
};
