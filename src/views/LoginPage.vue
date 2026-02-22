<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="login-container">
        <div class="login-header">
          <h2>Willkommen zurück</h2>
          <p>Bitte melden Sie sich an, um fortzufahren.</p>
        </div>
        <form @submit.prevent="handleLogin">
          <ion-item>
            <ion-input
              label="E-Mail"
              label-placement="stacked"
              type="email"
              v-model="email"
              name="email"
              autocomplete="username"
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
              required
              ><ion-input-password-toggle slot="end"></ion-input-password-toggle
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
      </div>
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
  IonInputPasswordToggle,
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
<style scoped>
.login-container {
  max-width: 450px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

@media (max-width: 480px) {
  .login-container {
    margin-top: 20px;
    max-width: 100%;
  }
}
</style>
