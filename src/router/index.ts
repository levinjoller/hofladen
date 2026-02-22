import { createRouter, createWebHashHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import { supabase } from "@/supabase";
import { useAuthStore } from "@/stores/auth-store";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/LoginPage.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/views/HomePage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/product",
    name: "ProductList",
    component: () => import("@/views/ProductListPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/supplier",
    name: "SupplierList",
    component: () => import("@/views/SupplierListPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/customer",
    name: "CustomerList",
    component: () => import("@/views/CustomerListPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/palox",
    name: "PaloxList",
    component: () => import("@/views/PaloxListPage.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

supabase.auth.onAuthStateChange((event, session) => {
  if (!session) {
    router.push("/login");
  }
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  if (!authStore.isInitialized) {
    await authStore.initialize();
  }
  const isAuthenticated = !!authStore.user;
  if (to.meta.requiresAuth && !isAuthenticated) {
    return "/login";
  }
  if (to.path === "/login" && isAuthenticated) {
    return "/home";
  }
});

export default router;
