<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <!-- Optional: Ein Zurück-Button, wenn diese Seite von einer anderen aus erreichbar ist -->
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Produkt Übersicht</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Produkt Übersicht</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="ion-padding">
        <p>Willkommen zur Produkt Übersicht</p>
        <ion-card>
          <ion-card-header>
            <ion-card-title>Produkte Übersicht</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list v-if="!loading && products.length > 0">
              <ion-item v-for="product in products" :key="product.id">
                <ion-label>
                  <h2>{{ product.display_name }}</h2>
                  <p>Erstellt am: {{ new Date(product.created_at).toLocaleDateString() }}</p>
                </ion-label>
              </ion-item>
            </ion-list>
            <p v-else-if="!loading && products.length === 0" class="ion-text-center">Keine Produkte gefunden.</p>
            <p v-else class="ion-text-center">Lade Produkte...</p>
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
  IonButtons, // Für den Zurück-Button
  IonBackButton, // Für den Zurück-Button
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/vue';
import { useProducts } from '@/composables/useProducts';
const { products, loading, error, fetchProducts } = useProducts();
import { onMounted } from 'vue';

onMounted(async () => {
  await fetchProducts(); // Ruft die Produktdaten ab, wenn die Seite geladen wird
});
</script>