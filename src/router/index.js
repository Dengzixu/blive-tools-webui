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
            component: () => import('@/views/web/gift/NewImgDownloadView.vue')
        }]
    },]
})

export default router
