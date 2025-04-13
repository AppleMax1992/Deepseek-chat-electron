import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router'; // 确保路径正确
import 'normalize.css';
import '@arco-design/web-vue/dist/arco.css';
import ArcoVue from '@arco-design/web-vue';
import './index.css';
import { fakeBackend } from '@renderer/helpers';
// import 'element-plus/dist/index.css'
fakeBackend();
const app = createApp(App);
app.use(router);
app.use(ArcoVue)
app.use(createPinia());

app.mount('#app');