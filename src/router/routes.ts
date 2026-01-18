import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // PUBLIC ROUTES (Login)
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LoginPage.vue') }
    ]
  },

  // PRIVATE ROUTES (Dashboard / CRUD)
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/patients' },
      { path: 'patients', component: () => import('pages/PatientsPage.vue') }
    ],
  },

  // 404 Not Found
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
