import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/LoginView.vue')
  },

  {
    path: '/import',
    name: 'import',
    component: () => import('../views/ImportView.vue')
  },
  {
    path: '/export',
    name: 'export',
    component: () => import('../views/ExportView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
