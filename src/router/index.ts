// import RegistrationOrAuthView from '@/views/RegistrationOrAuthView.vue';
// import WorkSpace from '@/views/WorkSpace.vue';
// import { createRouter, createWebHistory } from 'vue-router';

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/login',
//       name: 'login',
//       component: RegistrationOrAuthView,
//     },
//     {
//       path: '/main',
//       name: 'main',
//       component: WorkSpace,
//     },
//   ],
// });

// export default router;

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
    // Можно также добавить редирект для неизвестных маршрутов
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  if (to.path === '/login' && isAuthenticated) {
    // Если пользователь уже авторизован, не пускаем его на логин
    return next('/main');
  }

  if (to.matched.length === 0) {
    // Неправильный маршрут — редиректим в зависимости от авторизации
    return next(isAuthenticated ? '/main' : '/login');
  }

  // Если маршрут защищён и пользователь не авторизован — редирект на логин
  if (to.path !== '/login' && !isAuthenticated) {
    return next('/login');
  }

  next();
});

export default router;
