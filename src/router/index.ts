import { createRouter, createWebHashHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import ProductsOverviewPage from '@/views/ProductsOverviewPage.vue';
import LoginPage from '@/views/LoginPage.vue';
import SuppliersOverviewPage from '@/views/SuppliersOverviewPage.vue';
import { supabase } from '@/supabase';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/products-overview',
    name: 'ProductsOverview',
    component: ProductsOverviewPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/suppliers-overview',
    name: 'SuppliersOverview',
    component: SuppliersOverviewPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/customers',
    name: 'CustomersOverview',
    component: () => import('@/views/CustomersOverviewPage.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession();

  if (to.meta.requiresAuth && !session) {
    next('/login');
  } else if (to.path === '/login' && session) {
    next('/home');
  } else {
    next();
  }
});

export default router
