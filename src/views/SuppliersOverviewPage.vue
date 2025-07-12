<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Lieferanten Übersicht</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Lieferanten Übersicht</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="ion-padding">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Lieferanten</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list v-if="!suppliersLoading && suppliers.length > 0">
              <ion-item v-for="supplier in suppliers" :key="supplier.id">
                <ion-label>
                  <h2>{{ supplier.display_name }}</h2>
                  <p>Erstellt am: {{ new Date(supplier.created_at).toLocaleDateString('de-DE') }}</p>
                </ion-label>
              </ion-item>
            </ion-list>
            <p v-else-if="!suppliersLoading && suppliers.length === 0" class="ion-text-center">Keine Lieferanten gefunden.</p>
            <p v-else-if="suppliersError" class="ion-text-center ion-text-danger">{{ suppliersError }}</p>
            <p v-else class="ion-text-center">Lade Lieferanten...</p>
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
import { useRouter } from 'vue-router';
import { useToast } from '@/services/toastService';
import {
  suppliers,
  suppliersLoading,
  suppliersError,
  initializeSupplierData,
  unsubscribeFromSupplierChanges
} from '@/services/supplierService';

const router = useRouter();
const { presentToast, showToast, toastMessage, toastColor, toastDuration } = useToast();

onMounted(() => {
  initializeSupplierData(presentToast);
});

onUnmounted(() => {
  unsubscribeFromSupplierChanges();
});

onActivated(() => {
  console.log('SuppliersOverviewPage activated.');
  if (suppliersError.value) {
    presentToast(suppliersError.value, 'danger');
  }
});
</script>