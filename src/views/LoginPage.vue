<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-input
          label="E-Mail"
          label-placement="floating"
          type="email"
          v-model="email"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-input
          label="Passwort"
          label-placement="floating"
          type="password"
          v-model="password"
        ></ion-input>
      </ion-item>
      <ion-button
        expand="block"
        :disabled="!isFormFilledOut"
        @click="handleLogin"
        >Login</ion-button
      >
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
} from "@ionic/vue";

import { useRouter } from "vue-router";
import { login } from "@/services/auth-service";

const router = useRouter();

const email = ref("");
const password = ref("");

const isFormFilledOut = computed(() => {
  return email.value.trim() !== "" && password.value.trim().length >= 6;
});

const handleLogin = async () => {
  const success = await login(email.value, password.value);

  if (success) {
    router.push("/home");
  }
};
</script>
