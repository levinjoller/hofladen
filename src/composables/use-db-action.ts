import { ref, computed, type Ref, type UnwrapRef } from "vue";
import { getUserFriendlyErrorMessage } from "@/utils/get-user-friendly-error-message";

export type Fetcher<T, Args extends unknown[] = any[]> = (
  ...args: Args
) => Promise<T>;

export type FetcherArray<T, Args extends unknown[] = any[]> = (
  ...args: Args
) => Promise<T[]>;

export interface UseDbResult<T, Args extends unknown[] = any[]> {
  data: Ref<UnwrapRef<T>>;
  isLoading: Ref<boolean>;
  error: Ref<unknown | null>;
  errorMessage: Ref<string>;
  execute: (...args: Args) => Promise<T | null>;
  reset: () => void;
}

function useDbBase<T, Args extends unknown[]>(
  executor: Fetcher<T, Args>,
  initialValue: T,
  onStatusChange?: (loading: boolean, errorMessage: string | null) => void,
): UseDbResult<T, Args> {
  const data = ref<T>(initialValue) as Ref<UnwrapRef<T>>;
  const isLoading = ref(false);
  const error = ref<unknown | null>(null);
  const errorMessage = computed(() =>
    error.value ? getUserFriendlyErrorMessage(error.value) : "",
  );

  function updateError(err: unknown | null) {
    error.value = err;
    if (onStatusChange) {
      onStatusChange(
        isLoading.value,
        err ? getUserFriendlyErrorMessage(err) : null,
      );
    }
  }

  const execute = async (...args: Args): Promise<T | null> => {
    isLoading.value = true;
    updateError(null);
    try {
      const result = await executor(...args);
      data.value = (result ?? initialValue) as UnwrapRef<T>;
      return result ?? null;
    } catch (err: unknown) {
      updateError(err);
      return null;
    } finally {
      isLoading.value = false;
      onStatusChange?.(false, error.value ? errorMessage.value : null);
    }
  };

  const reset = () => {
    data.value = initialValue as UnwrapRef<T>;
    updateError(null);
    isLoading.value = false;
  };

  return { data, isLoading, error, errorMessage, execute, reset };
}

export function useDbFetch<T, F extends FetcherArray<T>>(
  fetcher: F,
  onStatusChange?: (loading: boolean, errorMessage: string | null) => void,
): UseDbResult<T[], Parameters<F>> {
  return useDbBase<T[], Parameters<F>>(fetcher, [], onStatusChange);
}

export function useDbAction<T = void, A extends Fetcher<T> = Fetcher<T>>(
  action: A,
  onStatusChange?: (loading: boolean, errorMessage: string | null) => void,
): UseDbResult<T | null, Parameters<A>> {
  return useDbBase<T | null, Parameters<A>>(action, null, onStatusChange);
}
