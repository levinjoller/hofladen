import { createRouter, createWebHashHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import { supabase } from "@/supabase";

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
  {
    path: "/palox/new",
    name: "PaloxCreate",
    component: () => import("@/views/PaloxCreatePage.vue"),
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
