import { computed, ref } from "vue";
import { KnownError } from "@/types/errors";
import { isPostgrestError, isZodError } from "@/utils/type-guards";
import { getUserFriendlyErrorMessage } from "@/utils/get-user-friendly-error-message";

export function useDbAction<T, Args extends any[]>(
  fetcher: (...args: Args) => Promise<T>
) {
  const data = ref<T | null>(null);
  const isLoading = ref(false);
  const error = ref<KnownError | null>(null);
  const errorMessage = computed(() => {
    if (!error.value) return "";
    return getUserFriendlyErrorMessage(error.value);
  });

  const execute = async (...args: Args): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    try {
      data.value = await fetcher(...args);
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
