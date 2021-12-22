import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'table', component: () => import('components/Tables.vue') },
      { path: 'upload', component: () => import('components/FileUploader.vue') },
    ],
  },
  // {
  //   path: '/table',
  //   component: () => import('components/Tables.vue'),
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
