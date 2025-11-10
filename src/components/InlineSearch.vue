<template>
  <div>
    <ion-searchbar
      v-if="isSearchable"
      ref="searchbarRef"
      :placeholder="`Suche ${title}...`"
      :inputmode="effectiveSearchType"
      :debounce="300"
      @ionInput="handleSearchInput"
      show-clear-button="always"
      animated
    />
    <LoadingSpinner v-if="isLoading" />
    <div
      v-else-if="
        data.length === 0 &&
        (!isSearchable || searchTerm.length >= effectiveMinLength)
      "
    >
      <p class="ion-text-center">Kein/e {{ title }} gefunden.</p>
    </div>
    <ion-list v-else-if="data.length > 0">
      <ion-item
        v-for="option in data"
        :key="option.id"
        button
        @click="selectOption(option)"
      >
        <ion-label>{{ option.display_name }}</ion-label>
      </ion-item>
    </ion-list>
  </div>
</template>

<script setup lang="ts" generic="T extends SearchType">
import { ref, onMounted, nextTick, Ref, watch, computed } from "vue";
import { IonSearchbar, IonList, IonItem, IonLabel } from "@ionic/vue";
import { useDbFetch } from "@/composables/use-db-action";
import { isNumericKey } from "@/utils/is-numeric-key";
import { getSearchTermValue } from "@/utils/search-term-helper";
import { SearchType } from "@/types/search-type";
import { presentToast } from "@/services/toast-service";
import LoadingSpinner from "./LoadingSpinner.vue";
import type { DropdownSearchItem } from "@/types/dropdown-search-item";
import type { ConditionalFetchMethod } from "@/types/conditional-fetch-types";

const props = defineProps<{
  title: string;
  fetchMethod: ConditionalFetchMethod<T>;
  isSearchable: boolean;
  searchType?: T;
  placeholder?: string;
  minLength?: number;
}>();

const emit = defineEmits<{ (e: "select", value: DropdownSearchItem): void }>();
const searchTerm = ref("");
const selecting = ref(false);
const searchbarRef: Ref<InstanceType<typeof IonSearchbar> | null> = ref(null);

const { data, isLoading, errorMessage, execute } = useDbFetch<
  DropdownSearchItem,
  typeof props.fetchMethod
>(props.fetchMethod);

watch(errorMessage, (newError) => {
  if (newError) presentToast(newError, "danger", 10000);
});

let lastRequestId = 0;

const effectiveSearchType = computed(() => props.searchType ?? SearchType.Text);
const effectiveMinLength = computed(
  () =>
    props.minLength ?? (effectiveSearchType.value === SearchType.Text ? 3 : 1)
);

onMounted(async () => {
  if (!props.isSearchable) {
    await execute();
  } else {
    await initSearchbarFocusAndEvents();
  }
});

async function initSearchbarFocusAndEvents() {
  await nextTick();
  setTimeout(() => {
    focusSearchbar();
    const input = searchbarRef.value?.$el?.querySelector("input");
    if (input) {
      input.removeEventListener("keydown", handleSearchbarKeydown);
      input.addEventListener("keydown", handleSearchbarKeydown);
    }
  }, 100);
}

function focusSearchbar() {
  const searchbarEl = searchbarRef.value?.$el as
    | HTMLIonSearchbarElement
    | undefined;
  searchbarEl?.setFocus?.();
}

function handleSearchbarKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    handleEnter();
  } else if (
    effectiveSearchType.value === SearchType.Numeric &&
    !isNumericKey(e)
  ) {
    e.preventDefault();
  }
}

const handleEnter = () => {
  if (data.value.length > 0) selectOption(data.value[0]);
};

const handleSearchInput = async (event: Event) => {
  const raw = (event.target as HTMLInputElement).value;
  searchTerm.value = raw;
  const term = getSearchTermValue(
    raw,
    effectiveSearchType.value,
    effectiveMinLength.value
  );
  const requestId = ++lastRequestId;
  if (term === null) {
    data.value = [];
    return;
  }
  if (effectiveSearchType.value === SearchType.Numeric) {
    await (execute as ConditionalFetchMethod<SearchType.Numeric>)(
      term as number
    );
  } else {
    await (execute as ConditionalFetchMethod<SearchType.Text>)(term as string);
  }
  if (requestId !== lastRequestId) return;
};

const selectOption = async (option: DropdownSearchItem) => {
  if (selecting.value) return;
  selecting.value = true;
  emit("select", option);
  searchTerm.value = "";
  data.value = [];
  await nextTick();
  selecting.value = false;
};
</script>

<style scoped>
ion-list {
  margin-top: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
