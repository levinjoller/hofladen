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
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
import { supabase } from '@/supabase';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
  errorMessage.value = ''; // Fehlermeldung zurücksetzen
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      errorMessage.value = error.message;
      console.error('Login error:', error.message);
    } else {
      console.log('User logged in:', data.user);
      router.push('/home');
    }
  } catch (err) {
    errorMessage.value = 'An unexpected error occurred.';
    console.error('Unexpected login error:', err);
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