<template>
  <ion-app>
    <ion-menu
      v-if="user"
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
              <ion-icon
                aria-hidden="true"
                slot="start"
                :icon="p.icon"
              ></ion-icon>
              <ion-label>{{ p.title }}</ion-label>
            </ion-item>
          </ion-menu-toggle>

          <ion-item
            lines="none"
            class="logout-menu-item"
            button
            @click="handleLogout"
          >
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
  IonToast,
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
import { user, getCurrentUser, logout } from "@/services/auth-service";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const appPages = [
  { title: "Home", url: "/home", icon: home, requiresAuth: true },
  {
    title: "Produkte",
    url: "/products-overview",
    icon: nutrition,
    requiresAuth: true,
  },
  {
    title: "Lieferanten",
    url: "/suppliers-overview",
    icon: people,
    requiresAuth: true,
  },
  {
    title: "Kunden",
    url: "/customers",
    icon: personCircle,
    requiresAuth: true,
  },
  { title: "Paloxen", url: "/pallet", icon: layers, requiresAuth: true },
];

const { showToast, toastMessage, toastColor, toastDuration } = useToast();
const router = useRouter();

const handleLogout = async () => {
  await logout();
  router.push("/login");
};

onMounted(async () => {
  await getCurrentUser();
});
</script>
