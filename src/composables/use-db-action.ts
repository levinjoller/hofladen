import { ref, computed } from "vue";
import { KnownError } from "@/types/errors";
import { isPostgrestError, isZodError } from "@/utils/type-guards";
import { getUserFriendlyErrorMessage } from "@/utils/get-user-friendly-error-message";

type Fetcher<T> = (...args: any[]) => Promise<T>;
type FetcherArray<T> = (...args: any[]) => Promise<T[]>;

function useDbBase<T>(executor: Fetcher<T>, initialValue: T) {
  const data = ref<T>(initialValue);
  const isLoading = ref(false);
  const error = ref<KnownError | null>(null);
  const errorMessage = computed(() =>
    error.value ? getUserFriendlyErrorMessage(error.value) : ""
  );

  const execute = async (...args: any[]): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await executor(...args);
      data.value = result ?? initialValue;
      return true;
    } catch (err: unknown) {
      if (isZodError(err) || isPostgrestError(err) || err instanceof Error) {
        error.value = err;
      } else {
        error.value = new Error("");
      }
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return { data, isLoading, error, errorMessage, execute };
}

// For SELECT
export function useDbFetch<T>(fetcher: FetcherArray<T>) {
  return useDbBase<T[]>(fetcher, []);
}

// For POST, PUT, DELETE
export function useDbAction<T = void>(action: Fetcher<T>) {
  return useDbBase<T | null>(action, null);
}
