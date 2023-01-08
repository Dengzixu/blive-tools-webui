import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [{
        path: '/',
        alias: '/web',
        name: 'home',
        component: () => import('@/views/web/WebHomeView.vue')
    },]
})

export default router
