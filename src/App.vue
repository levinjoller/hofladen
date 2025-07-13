<template>
  <ion-app>
    <ion-menu content-id="main-content" type="overlay" :swipe-gesture="!!user">
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
import { home, nutrition, people, logOut, personCircle } from 'ionicons/icons';
import { user, getCurrentUser, logout } from '@/services/authService';
import { useRouter } from 'vue-router';
import { App } from '@capacitor/app';
import { onMounted, onUnmounted } from 'vue';
import { unsubscribeFromCustomerChanges, reinitializeCustomerData } from './services/customerService';
import { unsubscribeFromSupplierChanges, reinitializeSupplierData } from './services/supplierService';
import { supabase } from './supabase';
import { unsubscribeFromProductChanges, reinitializeProductData } from './services/productService';
const appPages = [
  { title: 'Home', url: '/home', icon: home },
  { title: 'Produkte', url: '/products-overview', icon: nutrition },
  { title: 'Lieferanten', url: '/suppliers-overview', icon: people },
  { title: 'Kunden', url: '/customers', icon: personCircle },
];

const { presentToast, showToast, toastMessage, toastColor, toastDuration } = useToast();
const router = useRouter();

const handleLogout = async () => {
  await logout(presentToast, router);
};
let authListenerRef: { subscription: { unsubscribe: () => void; }; } | null = null;
const handleAppStateChange = async ({ isActive }: { isActive: boolean }) => {
  console.log('App state changed. isActive:', isActive);
  if (isActive) {
    reinitializeCustomerData(presentToast);
    reinitializeSupplierData(presentToast);
    reinitializeProductData(presentToast);
  } else {
    unsubscribeFromCustomerChanges();
    unsubscribeFromSupplierChanges();
    unsubscribeFromProductChanges();
    console.log('App put in background, subscriptions unsubscribed.');
  }
};

let appStateListenerHandle: { remove: () => void; } | null = null;

onMounted(async () => {
  await getCurrentUser();
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log('Auth event:', event, 'Session:', session);
      user.value = session ? session.user : null;
      if (event === 'SIGNED_OUT') {
        console.log('User has been signed out by Supabase.');
        presentToast('Sie wurden erfolgreich abgemeldet.', 'success', 2000);
      } else if (event === 'SIGNED_IN' && session) {
        console.log('User has been signed in by Supabase.');
      }
    }
  );
  authListenerRef = { subscription };

  appStateListenerHandle = await App.addListener('appStateChange', handleAppStateChange);
  console.log('Capacitor App State Listener added.');
});

onUnmounted(() => {
  if (authListenerRef && authListenerRef.subscription && typeof authListenerRef.subscription.unsubscribe === 'function') {
    authListenerRef.subscription.unsubscribe();
    console.log('Auth state change listener unsubscribed.');
  }

  if (appStateListenerHandle && typeof appStateListenerHandle.remove === 'function') {
    appStateListenerHandle.remove();
    console.log('Capacitor App State Listener removed.');
  }

  unsubscribeFromCustomerChanges();
  unsubscribeFromSupplierChanges();
  unsubscribeFromProductChanges();
});
</script>
