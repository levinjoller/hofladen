<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="closeModal">
            <ion-icon :icon="chevronBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Suchen nach {{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-searchbar
        v-if="isSearchable"
        ref="searchbarRef"
        :placeholder="
          searchType === 'numeric'
            ? 'Nummer eintippen...'
            : 'Min. 3 Zeichen eintippen...'
        "
        :inputmode="searchType === 'numeric' ? 'numeric' : 'text'"
        :debounce="300"
        @ionInput="handleSearchInput"
        @keydown.enter="handleEnter"
        @keydown="searchType === 'numeric' ? isNumericKey : undefined"
      />

      <div v-if="isLoading" class="ion-text-center loading-spinner-container">
        <ion-spinner name="crescent"></ion-spinner>
      </div>
      <div
        v-else-if="
          !isLoading &&
          data.length === 0 &&
          (searchType === 'numeric'
            ? searchTerm.length > 0
            : searchTerm.length >= 3)
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
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, Ref, watch } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  modalController,
} from "@ionic/vue";
import { chevronBackOutline } from "ionicons/icons";
import type { DropdownSearchItem } from "@/types/dropdown-search-item";
import { useDbFetch } from "@/composables/use-db-action";
import { isNumericKey } from "@/utils/is-numeric-key";

const props = defineProps<{
  title: string;
  fetchMethod: (searchTerm?: number | string) => Promise<DropdownSearchItem[]>;
  isSearchable?: boolean;
  searchType?: "numeric" | "text";
}>();

const { data, isLoading, execute } = useDbFetch(props.fetchMethod);
const searchbarRef: Ref<InstanceType<typeof IonSearchbar> | null> = ref(null);
const searchTerm = ref("");

onMounted(async () => {
  if (!props.isSearchable) {
    await execute();
  }
});

watch(
  () => props.isSearchable,
  async (newVal) => {
    if (newVal) {
      await nextTick(() => {
        setTimeout(() => {
          if (searchbarRef.value) {
            searchbarRef.value.$el.setFocus();
          }
        }, 100);
      });
    }
  },
  { immediate: true }
);

const handleSearchInput = async (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  searchTerm.value = value;

  const isNumeric = props.searchType === "numeric";
  const cleaned = isNumeric ? value.replace(/\D/g, "") : value;

  if (isNumeric) {
    const num = parseInt(cleaned);
    if (!cleaned || isNaN(num)) return (data.value = []);
    await execute(num);
  } else {
    if (cleaned.length >= 3) {
      await execute(cleaned);
    } else {
      data.value = [];
    }
  }
};

function digitsOnly(event: KeyboardEvent) {
  !isNumericKey(event) && event.preventDefault();
}

const handleEnter = () => {
  if (data.value.length > 0) {
    selectOption(data.value[0]);
  }
};

const selectOption = (option: DropdownSearchItem) => {
  modalController.dismiss(option);
};

function closeModal() {
  modalController.dismiss();
}
</script>
