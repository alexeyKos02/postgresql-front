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
//     // Можно также добавить редирект для неизвестных маршрутов
//     {
//       path: '/:pathMatch(.*)*',
//       redirect: '/login',
//     },
//   ],
// });

// // Навигационный guard
// router.beforeEach((to, from, next) => {
//   const publicPages = ['/login'];
//   const authRequired = !publicPages.includes(to.path);
//   const token = localStorage.getItem('token');

//   if (authRequired && !token) {
//     return next('/login');
//   }

//   // Если залогинен или идёт на публичную страницу — пропускаем
//   next();
// });

// export default router;
