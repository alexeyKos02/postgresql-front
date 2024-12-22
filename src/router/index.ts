import RegistrationOrAuthView from '@/views/RegistrationOrAuthView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: RegistrationOrAuthView,
    },
    {
      path: '/about',
      name: 'about',
      component: {},
    },
  ],
})

export default router
