<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="floating">E-Mail</ion-label>
        <ion-input type="email" v-model="email"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Passwort</ion-label>
        <ion-input type="password" v-model="password"></ion-input>
      </ion-item>
      <ion-button expand="block" @click="handleLogin">Login</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  IonPage, 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
} from '@ionic/vue';

import { useRouter } from 'vue-router';
import { login } from '@/services/authService';

const router = useRouter();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  const success = await login(email.value, password.value);

  if (success) {
    router.push('/home');
  }
};
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>