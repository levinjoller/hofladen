<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Kunden Übersicht</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Kunden Übersicht</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="ion-padding">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Kunden</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list v-if="!customersLoading && customers.length > 0">
              <ion-item v-for="customer in customers" :key="customer.id">
                <ion-label>
                  <h2>{{ customer.person?.display_name }}</h2>
                  <p>Erstellt am: {{ new Date(customer.created_at).toLocaleDateString('de-DE') }}</p>
                </ion-label>
              </ion-item>
            </ion-list>
            <p v-else-if="!customersLoading && customers.length === 0" class="ion-text-center">Keine Kunden gefunden.</p>
            <p v-else-if="customersError" class="ion-text-center ion-text-danger">{{ customersError }}</p>
            <p v-else class="ion-text-center">Lade Kunden...</p>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>

    <ion-toast
      :is-open="showToast"
      :message="toastMessage"
      :duration="toastDuration"
      :color="toastColor"
      @didDismiss="showToast = false"
    ></ion-toast>

  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonToast,
} from '@ionic/vue';
import { onMounted, onActivated, onUnmounted } from 'vue';
import { useToast } from '@/services/toastService';
import { 
    customers,
    customersLoading,
    customersError,
    initializeCustomerData,
    unsubscribeFromCustomerChanges
} from '@/services/customerService';

const { presentToast, showToast, toastMessage, toastColor, toastDuration } = useToast();

onMounted(() => {
  initializeCustomerData(presentToast);
});

onUnmounted(() => {
  unsubscribeFromCustomerChanges();
});

onActivated(() => {
  console.log('CustomerOverviewPage activated.');
  if (customersError.value) {
    presentToast(customersError.value, 'danger');
  }
});
</script>