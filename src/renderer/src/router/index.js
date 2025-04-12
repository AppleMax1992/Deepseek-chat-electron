import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import ChatWebSocket from '../views/ChatWebSocket.vue'
// import ChatAI from '../components/MainBox/ChatAI.vue'
// import NsfwAI from '../components/NsfwBox/NsfwAI.vue'
// import SexyVideo from '../components/SexyBox/SexyVideo.vue'


const routes = [
    {
        path: '/',
        name: 'ChatWebSocket',
        component: ChatWebSocket
    },

]

// 3、创建一个路由的对象
const router = createRouter({
    // 指定模式
    /**
     * createWebHashHistory 带 # 号
     * createWebHistory 不带 # 号
     */
    history: createWebHashHistory(),
    // 下面这个 可以写成ES6的简写 routers
    routes:routes
})

export default router
