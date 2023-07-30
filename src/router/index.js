import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [{
        path: '/',
        alias: '/web',
        name: 'home',
        component: () => import('@/views/web/WebHomeView.vue'),
        children: [{
            path: 'gift/image_download',
            name: 'imageDownload',
            component: () => import('@/views/web/utils/GiftImgDownloadView.vue')
        }, {
            path: '/obs/timer-config',
            name: 'timerConfig',
            component: () => import('@/views/web/obs/TimerConfigView.vue')
        }]
    }, {
        path: '/obs-plugin',
        name: 'obs-plugin',
        children: [{
            path: 'timer',
            name: 'obs-plugin-timer',
            component: () => import('@/views/obs/timer/TimerFrameView.vue')
        }]
    }]
})

export default router
