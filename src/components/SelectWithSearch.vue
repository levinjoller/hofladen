<template>
  <ion-item button :disabled="!!isParentLoading" @click="toggleDropdown">
    <ion-label>{{ title }}</ion-label>
    <ion-label slot="end" class="ion-text-wrap">
      {{ modelValue?.display_name ?? placeholder }}
    </ion-label>
    <ion-spinner
      v-if="isParentLoading"
      slot="end"
      name="crescent"
      color="medium"
    />
    <ion-icon
      v-if="modelValue && !isParentLoading"
      slot="end"
      :icon="closeOutline"
      @click.stop="clearSelection"
      color="medium"
    />
  </ion-item>

  <div v-if="showSearch" class="ion-padding-horizontal">
    <InlineSearchAsync
      :title="title"
      :fetchMethod="fetchMethod"
      :isSearchable="isSearchable"
      :searchType="effectiveSearchType"
      :minLength="minLength"
      @select="handleSelect"
    />
  </div>
</template>

<script setup lang="ts" generic="T extends SearchType = SearchType.Text">
import { ref, computed } from "vue";
import { IonItem, IonIcon, IonLabel, IonSpinner } from "@ionic/vue";
import { closeOutline } from "ionicons/icons";
import type { DropdownSearchItem } from "@/types/dropdown-search-item";
import type { ConditionalFetchMethod } from "@/types/conditional-fetch-types";
import { SearchType } from "@/types/search-type";
import { defineAsyncComponent } from "vue";
import LoadingSpinner from "./LoadingSpinner.vue";

const InlineSearchAsync = defineAsyncComponent({
  loader: () => import("./InlineSearch.vue"),
  loadingComponent: LoadingSpinner,
  delay: 200,
});

const props = defineProps<{
  title: string;
  fetchMethod: ConditionalFetchMethod<T>;
  isSearchable?: boolean;
  searchType?: T;
  placeholder?: string;
  isParentLoading?: boolean;
  minLength?: number;
}>();

const isSearchable = computed(() => props.isSearchable ?? true);
const effectiveSearchType = computed<T>(
  () => props.searchType ?? (SearchType.Text as T)
);
const modelValue = defineModel<DropdownSearchItem | null>({ default: null });
const showSearch = ref(false);

function toggleDropdown() {
  if (!props.isParentLoading) showSearch.value = !showSearch.value;
}

function handleSelect(item: DropdownSearchItem) {
  modelValue.value = item;
  showSearch.value = false;
}

function clearSelection(e: MouseEvent) {
  e.stopPropagation();
  modelValue.value = null;
  showSearch.value = false;
}
</script>
