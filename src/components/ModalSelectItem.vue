<template>
  <ion-item
    button
    :detail="true"
    @click="openModal"
    :disabled="isParentLoadingDefault || disabled"
  >
    <ion-label>{{ title }}</ion-label>
    <ion-text slot="end">
      <ion-spinner v-if="isParentLoadingDefault" name="crescent"></ion-spinner>
      <span v-else>{{ modelValue?.display_name }}</span>
    </ion-text>
  </ion-item>
</template>

<script setup lang="ts">
import {
  IonItem,
  IonLabel,
  IonText,
  modalController,
  IonSpinner,
} from "@ionic/vue";
import type { DropdownSearchItem } from "@/types/dropdown-search-item";

const props = defineProps<{
  title: string;
  modelValue: DropdownSearchItem | null;
  component: any;
  fetchMethod: (...args: any[]) => Promise<DropdownSearchItem[]>;
  isSearchable?: boolean;
  searchType?: "numeric" | "text";
  isParentLoadingDefault?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: DropdownSearchItem | null): void;
}>();

async function openModal() {
  const modal = await modalController.create({
    component: props.component,
    componentProps: {
      title: props.title,
      fetchMethod: props.fetchMethod,
      isSearchable: props.isSearchable,
      searchType: props.searchType,
    },
  });
  await modal.present();
  const { data } = await modal.onDidDismiss<DropdownSearchItem>();
  if (data) {
    emit("update:modelValue", data);
  }
}
</script>
