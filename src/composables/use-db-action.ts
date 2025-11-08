import { ref, computed, watch } from "vue";
import { getUserFriendlyErrorMessage } from "@/utils/get-user-friendly-error-message";

type Fetcher<T> = (...args: any[]) => Promise<T>;
type FetcherArray<T> = (...args: any[]) => Promise<T[]>;

function useDbBase<T>(
  executor: Fetcher<T>,
  initialValue: T,
  onStatusChange?: (loading: boolean, errorMessage: string | null) => void
) {
  const data = ref<T>(initialValue);
  const isLoading = ref(false);
  const error = ref<unknown | null>(null);
  const errorMessage = computed(() =>
    error.value ? getUserFriendlyErrorMessage(error.value) : ""
  );

  const execute = async (...args: any[]): Promise<T | null> => {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await executor(...args);
      data.value = result ?? initialValue;
      return result ?? null;
    } catch (err: unknown) {
      error.value = err;
      return null;
    } finally {
      isLoading.value = false;
    }
  };
  watch([isLoading, errorMessage], () => {
    if (onStatusChange) {
      onStatusChange(isLoading.value, errorMessage.value || null);
    }
  });
  return { data, isLoading, error, errorMessage, execute };
}

// For SELECT
export function useDbFetch<T>(
  fetcher: FetcherArray<T>,
  onStatusChange?: (loading: boolean, errorMessage: string | null) => void
) {
  return useDbBase<T[]>(fetcher, [], onStatusChange);
}

// For POST, PUT, DELETE
export function useDbAction<T = void>(
  action: Fetcher<T>,
  onStatusChange?: (loading: boolean, errorMessage: string | null) => void
) {
  return useDbBase<T | null>(action, null, onStatusChange);
}
