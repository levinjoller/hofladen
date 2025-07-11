import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import ProductsOverviewPage from '@/views/ProductsOverviewPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/products-overview'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/products-overview',
    name: 'ProductsOverview',
    component: ProductsOverviewPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
