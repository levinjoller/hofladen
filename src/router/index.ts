import { createRouter, createWebHashHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import { supabase } from "@/supabase";
import HomePage from "../views/HomePage.vue";
import ProductListPage from "@/views/ProductListPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import SupplierListPage from "@/views/SupplierListPage.vue";
import CustomerListPage from "@/views/CustomerListPage.vue";
import PalletListPage from "@/views/PalletListPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/product",
    name: "ProductList",
    component: ProductListPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/supplier",
    name: "SupplierList",
    component: SupplierListPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/customer",
    name: "CustomerList",
    component: CustomerListPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/pallet",
    name: "PalletList",
    component: PalletListPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/pallet/new",
    name: "PalletCreate",
    component: () => import("@/views/PalletCreatePage.vue"),
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

router.beforeEach(async (to, from, next) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (to.meta.requiresAuth && !session) {
    next("/login");
  } else if (to.path === "/login" && session) {
    next("/home");
  } else {
    next();
  }
});

export default router;
