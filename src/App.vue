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
          <ion-item lines="none" class="logout-menu-item" button @click="handleLogout">
            <ion-icon aria-hidden="true" slot="start" :icon="logOut"></ion-icon>
            <ion-label>Abmelden</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-menu>
  <ion-router-outlet id="main-content"></ion-router-outlet>
  </ion-app>

  <ion-toast
    :is-open="showToast"
    :message="toastMessage"
    :duration="toastDuration"
    :color="toastColor"
    @didDismiss="showToast = false"
  ></ion-toast>

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
  IonToast
} from '@ionic/vue';
import { useToast } from '@/services/toastService';
import { home, nutrition, people, logOut } from 'ionicons/icons';
import { logout } from '@/services/authService';
import { useRouter } from 'vue-router';
const appPages = [
  { title: 'Home', url: '/home', icon: home },
  { title: 'Produkte', url: '/products-overview', icon: nutrition },
  { title: 'Lieferanten', url: '/suppliers-overview', icon: people },
];

const { presentToast, showToast, toastMessage, toastColor, toastDuration } = useToast();
const router = useRouter();

const handleLogout = async () => {
  await logout(presentToast, router);
};
</script>
