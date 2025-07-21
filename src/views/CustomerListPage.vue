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
      <div class="ion-padding">
        <ion-card>
          <ion-card-content>
            <ion-list v-if="!customersLoading && customers.length > 0">
              <ion-item v-for="customer in customers" :key="customer.id">
                <ion-label>
                  <h2>{{ customer.person?.display_name }}</h2>
                  <p>
                    Erstellt am:
                    {{
                      new Date(customer.created_at).toLocaleDateString("de-DE")
                    }}
                  </p>
                </ion-label>
              </ion-item>
            </ion-list>
            <p
              v-else-if="!customersLoading && customers.length === 0"
              class="ion-text-center"
            >
              Keine Kunden gefunden.
            </p>
            <p
              v-else-if="customersError"
              class="ion-text-center ion-text-danger"
            >
              {{ customersError }}
            </p>
            <div v-else="loading" class="ion-padding ion-text-center">
              <ion-spinner name="crescent"></ion-spinner>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonList,
  IonItem,
  IonLabel,
  onIonViewWillEnter,
  IonCard,
  IonCardContent,
  IonSpinner,
} from "@ionic/vue";
import {
  customers,
  customersLoading,
  customersError,
  loadCustomersForList,
} from "@/services/customer-service";
import { onMounted } from "vue";

const loadCustomers = async () => {
  await loadCustomersForList(true);
};

onIonViewWillEnter(() => {
  loadCustomers();
});

onMounted(() => {
  loadCustomers();
});
</script>
