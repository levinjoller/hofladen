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
      <ion-searchbar v-model="searchTerm" placeholder="Suchen..." />

      <ion-list>
        <ion-item
          v-for="(option, index) in filteredOptions"
          :key="index"
          button
          @click="selectOption(option)"
        >
          <ion-label>{{ option }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script setup>
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
} from "@ionic/vue";
import { ref, computed, watch } from "vue";

const props = defineProps({
  modelValue: Boolean,
  selected: String,
  options: Array,
  title: { type: String, default: "Auswahl" },
});

const emit = defineEmits(["update:modelValue", "update:selected"]);

const isOpen = ref(props.modelValue);
const searchTerm = ref("");

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val;
    if (!val) searchTerm.value = "";
  }
);

const close = () => {
  isOpen.value = false;
  emit("update:modelValue", false);
};

const selectOption = (option) => {
  emit("update:selected", option);
  close();
};

const filteredOptions = computed(() =>
  props.options.filter((o) =>
    o.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
);
</script>
