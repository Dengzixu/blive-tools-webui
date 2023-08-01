import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
          component: () => import('@/views/web/obs/TimerConfigView.vue')
        },
        {
          path: 'plugin/clock-plugin-config',
          name: 'clockConfig',
          component: () => import('@/views/web/obs/ClockConfigView.vue')
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
          component: () => import('@/views/obs/timer/TimerOBSView.vue')
        },
        {
          path: 'clock',
          name: 'obs-plugin-clock',
          component: () => import('@/views/obs/timer/ClockOBSView.vue')
        }
      ]
    }
  ]
})

export default router
