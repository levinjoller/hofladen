<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form @submit.prevent="handleLogin">
        <ion-item>
          <ion-input
            label="E-Mail"
            label-placement="stacked"
            type="email"
            v-model="email"
            name="email"
            autocomplete="username"
            inputmode="email"
            required
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-input
            label="Passwort"
            label-placement="stacked"
            type="password"
            v-model="password"
            name="password"
            autocomplete="current-password"
            inputmode="text"
            required
          ></ion-input>
        </ion-item>
        <ion-button
          type="submit"
          expand="block"
          :disabled="!isFormFilledOut || isLoading"
        >
          <span v-if="!isLoading">Login</span>
          <ion-spinner v-else name="crescent"></ion-spinner>
        </ion-button>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonSpinner,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth-store";

const router = useRouter();
const authStore = useAuthStore();
const email = ref("");
const password = ref("");
const isLoading = ref(false);
const isFormFilledOut = computed(() => {
  return email.value.trim() !== "" && password.value.trim().length >= 6;
});
const handleLogin = async () => {
  if (!isFormFilledOut.value) return;
  isLoading.value = true;
  try {
    const success = await authStore.login(email.value, password.value);
    if (success) {
      router.replace("/home");
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
