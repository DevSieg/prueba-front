import { createApp } from 'vue';
import './assets/styles/app.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import { setUiStore } from './services/api';
import { useUiStore } from './stores/ui';

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);

setUiStore(useUiStore(pinia));

app.mount('#app');
