import RegistrationOrAuthView from '@/views/RegistrationOrAuthView.vue';
import WorkSpace from '@/views/WorkSpace.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: RegistrationOrAuthView,
    },
    {
      path: '/main',
      name: 'main',
      component: WorkSpace,
    },
  ],
});

export default router;
