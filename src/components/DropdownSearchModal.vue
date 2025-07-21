<template>
  <ion-modal :is-open="isOpen" @didDismiss="close">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="close">Schliessen</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-searchbar
        v-model="searchTerm"
        placeholder="Suchen..."
      ></ion-searchbar>

      <ion-list>
        <ion-item
          v-for="option in filteredOptions"
          :key="option.id"
          button
          @click="selectOption(option)"
        >
          <ion-label>{{ option.display_name }}</ion-label>
        </ion-item>
      </ion-list>

      <div v-if="loading" class="ion-padding ion-text-center">
        <ion-spinner name="crescent"></ion-spinner>
      </div>
      <ion-text
        v-else-if="filteredOptions.length === 0 && searchTerm === ''"
        class="ion-padding"
      >
        Keine Daten verfügbar.
      </ion-text>
      <ion-text
        v-else-if="filteredOptions.length === 0 && searchTerm !== ''"
        class="ion-padding"
      >
        Keine Suchergebnisse.
      </ion-text>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonContent,
  IonText,
  IonSpinner,
} from "@ionic/vue";
import { ref, computed, watch } from "vue";
import type { DropdownSearchItem } from "@/types/dropdown-search-item";

const props = defineProps<{
  modelValue: boolean;
  selected: DropdownSearchItem | null;
  title?: string;
  options: DropdownSearchItem[];
  loading: boolean;
  fetchMethod: () => Promise<void>;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "update:selected", value: DropdownSearchItem): void;
}>();

const isOpen = ref(props.modelValue);
const searchTerm = ref("");

watch(
  () => props.modelValue,
  async (val) => {
    isOpen.value = val;
    if (val) {
      searchTerm.value = "";
      await props.fetchMethod();
    }
  }
);

const close = () => {
  isOpen.value = false;
  emit("update:modelValue", false);
};

const selectOption = (option: DropdownSearchItem) => {
  emit("update:selected", option);
  close();
};

const filteredOptions = computed(() => {
  const options = props.options || [];
  if (!searchTerm.value) {
    return options;
  }
  const lower = searchTerm.value.toLowerCase();
  return options.filter((o) => o.display_name?.toLowerCase().includes(lower));
});
</script>
