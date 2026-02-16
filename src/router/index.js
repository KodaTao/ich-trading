import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/:symbol',
    name: 'symbol',
    component: () => import('../views/SymbolView.vue'),
  },
  {
    path: '/:symbol/:date',
    name: 'post',
    component: () => import('../views/PostView.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
