import { createRouter, createWebHistory } from 'vue-router';
import store from '../store/index'; // Corrigido o caminho para a store

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'Login' }
  },
  {
    path: '/import',
    name: 'import',
    component: () => import('../views/ImportView.vue'),
    meta: { title: 'Importe os CEPs', requiresAuth: true }
  },
  {
    path: '/export',
    name: 'export',
    component: () => import('../views/ExportView.vue'),
    meta: { title: 'Resultado', requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Sua Aplicação';
  const token = store.state.token;

  if (to.meta.requiresAuth) {
    if (token) {
      next();
    } else {
      next('/');
    }
  } else {
    next();
  }
});

export default router;
