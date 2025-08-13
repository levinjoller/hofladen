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

      <ion-list v-if="filteredOptions.length > 0">
        <ion-item
          v-for="option in filteredOptions"
          :key="option.id"
          button
          @click="selectOption(option)"
        >
          <ion-label>{{ option.display_name }}</ion-label>
        </ion-item>
      </ion-list>

      <div v-if="isLoading" class="ion-padding ion-text-center">
        <ion-spinner name="crescent" />
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
import { useDbAction } from "@/composables/use-db-action";
import { presentToast } from "@/services/toast-service";

const props = defineProps<{
  modelValue: boolean;
  selected: DropdownSearchItem | null;
  fetchMethod: () => Promise<DropdownSearchItem[]>;
  title?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "update:selected", value: DropdownSearchItem): void;
}>();

const searchTerm = ref("");

const { data, isLoading, errorMessage, execute } = useDbAction(
  props.fetchMethod
);

const isOpen = ref(props.modelValue);

watch(
  () => props.modelValue,
  async (val) => {
    isOpen.value = val;
    if (val) {
      searchTerm.value = "";
      await execute();
    }
  }
);

watch(errorMessage, (err) => {
  if (err) {
    presentToast(err, "danger", 10000);
  }
});

const filteredOptions = computed(() => {
  const list = data.value || [];
  const term = searchTerm.value.toLowerCase();
  return term
    ? list.filter((o) => o.display_name?.toLowerCase().includes(term))
    : list;
});

function selectOption(option: DropdownSearchItem) {
  emit("update:selected", option);
  close();
}
function close() {
  isOpen.value = false;
  emit("update:modelValue", false);
}
</script>
