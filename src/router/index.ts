import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      alias: '/web',
      name: 'home',
      component: () => import('@/views/web/WebHomeView.vue'),
      children: [
        {
          path: 'gift/image_download',
          name: 'imageDownload',
          component: () => import('@/views/web/utils/GiftImgDownloadView.vue')
        },
        {
          path: 'plugin/timer-plugin-config',
          name: 'timerConfig',
          component: () => import('@/views/web/obs-plugin/TimerConfigView.vue')
        },
        {
          path: 'plugin/clock-plugin-config',
          name: 'clockConfig',
          component: () => import('@/views/web/obs-plugin/ClockConfigView.vue')
        }
      ]
    },
    {
      path: '/obs',
      name: 'obs',
      children: [
        {
          path: 'timer',
          name: 'obs-plugin-timer',
          component: () => import('@/views/obs/TimerOBSView.vue')
        },
        {
          path: 'clock',
          name: 'obs-plugin-clock',
          component: () => import('@/views/obs/ClockOBSView.vue')
        }
      ]
    }
  ]
})

export default router
