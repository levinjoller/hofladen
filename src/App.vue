<template>
  <ion-app>
    <ion-menu content-id="main-content" type="overlay">
      <ion-header>
        <ion-toolbar>
          <ion-title>Navigation</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <ion-menu-toggle v-for="(p, i) in appPages" :key="i">
            <ion-item :router-link="p.url" router-direction="forward" lines="none" :detail="false">
              <ion-icon aria-hidden="true" slot="start" :icon="p.icon"></ion-icon>
              <ion-label>{{ p.title }}</ion-label>
            </ion-item>
          </ion-menu-toggle>
        </ion-list>
      </ion-content>
    </ion-menu>
  <ion-router-outlet id="main-content"></ion-router-outlet>
  </ion-app>
</template>

<script setup lang="ts">
import { 
  IonApp,
  IonRouterOutlet, 
  IonList,
  IonMenu,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/vue';
import { home, nutrition } from 'ionicons/icons';
const appPages = [
  { title: 'Home', url: '/home', icon: home },
  { title: 'Produkte', url: '/products-overview', icon: nutrition }
];
</script>
