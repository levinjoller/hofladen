import { ZodError } from "zod";
import { PostgrestError } from "@supabase/supabase-js";

export function isZodError(err: unknown): err is ZodError {
  return err instanceof ZodError;
}

export function isPostgrestError(err: unknown): err is PostgrestError {
  return (
    err !== null && typeof err === "object" && "code" in err && "message" in err
  );
}
