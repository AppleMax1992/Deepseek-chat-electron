import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import ChatWebSocket from '../views/ChatWebSocket.vue'
import accountRoutes from './account.routes';
import usersRoutes from './users.routes';
import { useAuthStore, useAlertStore } from '@renderer/stores';
import { Home } from '@renderer/views';
// import ChatAI from '../components/MainBox/ChatAI.vue'
// import NsfwAI from '../components/NsfwBox/NsfwAI.vue'
// import SexyVideo from '../components/SexyBox/SexyVideo.vue'


const routes = [
    {
        path: '/chat',
        name: 'ChatWebSocket',
        component: ChatWebSocket
    },
    { path: '/', component: Home },
    { ...accountRoutes },
    { ...usersRoutes },
    // catch all redirect to home page
    { path: '/:pathMatch(.*)*', redirect: '/' }

]

// 3、创建一个路由的对象
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    linkActiveClass: 'active',
    routes
});




router.beforeEach(async (to) => {
    // clear alert on route change
    const alertStore = useAlertStore();
    alertStore.clear();

    // redirect to login page if not logged in and trying to access a restricted page 
    const publicPages = ['/account/login', '/account/register'];
    const authRequired = !publicPages.includes(to.path);
    const authStore = useAuthStore();

    if (authRequired && !authStore.user) {
        authStore.returnUrl = to.fullPath;
        return '/account/login';
    }
});



export default router
