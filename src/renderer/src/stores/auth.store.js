import { defineStore } from 'pinia';
import router from '@renderer/router';
// console.log("我是user.store.js")
import {Post} from '@renderer/api/index'
import URLS from '@renderer/api/url'
export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        user: null,
        returnUrl: null
    }),
    actions: {
        async login(username, password) {
            try {
                const user = await Post(URLS.USER_LOGIN_URL, { username, password });
                this.user = user;
                router.push(this.returnUrl || '/');
            } 
            catch (error) {
                // const alertStore = useAlertStore();
                // alertStore.error(error);
                console.log('报错了')
            }
        },
        logout() {
            this.user = null;
            router.push('/account/login');
        }
    },
    persist: true  // 👈 启用持久化
});
// const authStore = useAuthStore();
// export default authStore