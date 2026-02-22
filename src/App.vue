<template>
  <ion-app>
    <template v-if="authStore.isInitialized">
      <ion-menu
        v-if="authStore.user"
        content-id="main-content"
        type="overlay"
        swipe-gesture
      >
        <ion-header>
          <ion-toolbar>
            <ion-title>Navigation</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-menu-toggle v-for="(p, i) in appPages" :key="i">
              <ion-item
                :router-link="p.url"
                router-direction="forward"
                lines="none"
                :detail="false"
              >
                <ion-icon slot="start" :icon="p.icon"></ion-icon>
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>

            <ion-item
              lines="none"
              class="logout-menu-item"
              button
              @click="handleLogout"
            >
              <ion-icon slot="start" :icon="logOut"></ion-icon>
              <ion-label>Abmelden</ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </template>
    <div v-else class="loading-overlay">
      <ion-spinner name="crescent"></ion-spinner>
    </div>
  </ion-app>

  <ion-toast
    position="top"
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
  IonToast,
  IonSpinner,
} from "@ionic/vue";
import { useToast } from "@/services/toast-service";
import {
  home,
  nutrition,
  people,
  logOut,
  personCircle,
  layers,
} from "ionicons/icons";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth-store";

const router = useRouter();
const authStore = useAuthStore();
const { showToast, toastMessage, toastColor, toastDuration } = useToast();
const appPages = [
  { title: "Home", url: "/home", icon: home },
  { title: "Produkte", url: "/product", icon: nutrition },
  { title: "Lieferanten", url: "/supplier", icon: people },
  { title: "Kunden", url: "/customer", icon: personCircle },
  { title: "Paloxen", url: "/palox", icon: layers },
];
const handleLogout = async () => {
  await authStore.logout();
  router.replace("/login");
};

onMounted(async () => {
  await authStore.initialize();
});
</script>

<style scoped>
.loading-overlay {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
}
</style>
