<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Produkte Übersicht</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="ion-padding">
        <ion-card>
          <ion-card-content>
            <ion-list v-if="!productsLoading && products.length > 0">
              <ion-item v-for="product in products" :key="product.id">
                <ion-label>
                  <h2>{{ product.display_name }}</h2>
                  <p>
                    Erstellt am:
                    {{ new Date(product.created_at).toLocaleDateString() }}
                  </p>
                </ion-label>
              </ion-item>
            </ion-list>
            <p
              v-else-if="!productsLoading && products.length === 0"
              class="ion-text-center"
            >
              Keine Produkte gefunden.
            </p>
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
  IonButtons,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonMenuButton,
  onIonViewWillEnter,
} from "@ionic/vue";
import {
  products,
  productsLoading,
  loadProductsForList,
} from "@/services/product-service";
import { onMounted } from "vue";

const loadProducts = async () => {
  await loadProductsForList(true);
};

onIonViewWillEnter(() => {
  loadProducts();
});

onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
.loading-spinner,
.error-message {
  text-align: center;
  padding: 20px;
}
</style>
