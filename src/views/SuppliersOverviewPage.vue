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
                  <h2>{{ supplier.person?.display_name }}</h2>
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
  onIonViewWillEnter,
} from '@ionic/vue';

import {
  suppliers,
  suppliersLoading,
  suppliersError,
  loadSupplierData,
} from '@/services/supplierService';

const loadSuppliers = async () => {
  await loadSupplierData(true);
};

onIonViewWillEnter(() => {
  loadSuppliers();
});
</script>