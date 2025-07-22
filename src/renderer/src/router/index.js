import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import ChatWebSocket from '../views/ChatWebSocket.vue'
// import accountRoutes from './account.routes';
// import usersRoutes from './users.routes';
// import documentsRoutes from './documents.routes';
import { useAuthStore, useAlertStore } from '@renderer/stores';
import { Home } from '@renderer/views';
// import { Layout, List, AddEdit } from '@renderer/views/documents';
// import ChatAI from '../components/MainBox/ChatAI.vue'
// import NsfwAI from '../components/NsfwBox/NsfwAI.vue'
// import SexyVideo from '../components/SexyBox/SexyVideo.vue'


const routes = [
    {
        path: '/chat',
        name: 'ChatWebSocket',
        component: ChatWebSocket
    },
    { 
        path: '/', component: Home, 
        meta: { 
            index: '1' 
        } 
    },
    { 
        path: '/account',
        
        component: function () {
            return import("@renderer/views/account/Layout.vue")
        }, 
        
        children: [
            { 
                path: 'login',         
                component: function () {
                    return import("@renderer/views/account/Login.vue")
                } 
            },
            { 
                path: 'register',                 
                component: function () {
                    return import("@renderer/views/account/Register.vue")
                }  
            }
        ]
    },
    {     
        path: '/users',
        component: function () {
            return import("@renderer/views/users/Layout.vue")
        },   
        meta: { 
            index: '2' 
        }, 
        children: [
            {
                path: '', // 空路径 = 默认子页面
                component: function () {
                    return import("@renderer/views/users/List.vue")
                }   
            },
            { 
                path: 'add',                 
                component: function () {
                    return import("@renderer/views/users/AddEdit.vue")
                }   
            },
            { 
                path: 'edit',                 
                component: function () {
                    return import("@renderer/views/users/AddEdit.vue")
                }   
            }
        ]
    },
    {     
        path: '/documents',
        component: function () {
            return import("@renderer/views/documents/Layout.vue")
        },   
        meta: { 
            index: '3' 
        }, 
        children: [
            {
                path: '', // 空路径 = 默认子页面
                component: function () {
                    return import("@renderer/views/documents/List.vue")
                },
                children:[
                    { 
                        path: '/documents',                 
                        component: function () {
                            return import("@renderer/views/documents/SearchGroup.vue")
                        }   
                    }
                ]   
            },
            { 
                path: 'add',                 
                component: function () {
                    return import("@renderer/views/documents/AddEdit.vue")
                }   
            },
            { 
                path: 'edit/:id',                 
                component: function () {
                    return import("@renderer/views/documents/AddEdit.vue")
                }   
            },
            { 
                path: 'manager',                 
                component: function () {
                    return import("@renderer/views/documents/Manager.vue")
                },
                meta: { 
                    index: '4' 
                }, 
            },
        ]
    },
    {
        path: '/doc',
        name: "UserDoc",
        component: function () {
            return import('../views/filterDoc/Index.vue')
        }
    },
    {
        path: "/searchResult",
        name: "searchResult",
        component: function () {
            return import("@renderer/views/searchResult/Layout.vue")
        },  
        meta: { 
            index: '3' 
        }, 
        children: [
            {
                path: '', // 空路径 = 默认子页面
                component: function () {
                    return import("../views/searchResult/Index.vue")
                },
            }
        ]
    },
    {
        path: "/preview",
        name: "preview",
        component: function () {
            return import("../views/preview/index.vue")
        }
    },
    {
        path: "/newPreview",
        name: "newPreview",
        component: function () {
            return import("../views/preview/PdfView1.vue")
        }
    },
    // {
    //     path: "docUpload",
    //     name: "docUpload",
    //     component: function () {
    //         return import("../views/userPage/DocUpload.vue")
    //     }
    // },
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
    // const alertStore = useAlertStore();
    // alertStore.clear();

    // redirect to login page if not logged in and trying to access a restricted page 
    const publicPages = ['/account/login', '/account/register'];
    const authRequired = !publicPages.includes(to.path);
    const authStore = useAuthStore();
    console.log("===================",authStore.user)
    if (authRequired && !authStore.user) {
        authStore.returnUrl = to.fullPath;
        return '/account/login';
    }
});



export default router
