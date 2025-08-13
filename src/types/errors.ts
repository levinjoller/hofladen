import { ZodError } from "zod";
import { PostgrestError } from "@supabase/supabase-js";

export type KnownError = ZodError | PostgrestError | Error;
