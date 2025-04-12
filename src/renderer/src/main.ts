import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router'; // 确保路径正确
import 'normalize.css';
import '@arco-design/web-vue/dist/arco.css';
import './index.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');