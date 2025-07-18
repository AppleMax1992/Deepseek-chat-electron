import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import '@renderer/api/request'
console.log("=========main.ts=======")
import App from './App.vue';

import 'normalize.css';
import '@arco-design/web-vue/dist/arco.css';
import ArcoVue from '@arco-design/web-vue';
import './index.css';
import { fakeBackend } from '@renderer/helpers';
import router from './router'; // 确保路径正确
// import { useAuthStore } from '@renderer/stores';

const pinia = createPinia()
// const authStore = useAuthStore();
// setAuthToken(() => authStore);
// const authStore = useAuthStore();
// console.log("=========authStore========",authStore)
// import 'element-plus/dist/index.css'
fakeBackend();
const app = createApp(App);

app.use(ArcoVue)
pinia.use(piniaPluginPersistedstate)
app.use(pinia);
app.use(router);
app.mount('#app');