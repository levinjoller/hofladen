import { ref } from "vue";

export function useFetch<T, Args extends any[]>(
  fetcher: (...args: Args) => Promise<T>
) {
  const data = ref<T | null>(null);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  const fetchData = async (...args: Args) => {
    isLoading.value = true;
    error.value = null;
    try {
      data.value = await fetcher(...args);
      return true;
    } catch (e: unknown) {
      error.value = e instanceof Error ? e : new Error("Unbekannter Fehler.");
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  return {
    data,
    isLoading,
    error,
    fetchData,
  };
}
