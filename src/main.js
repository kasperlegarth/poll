import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import localStorage from './mixins/localStorage';

createApp(App)
.mixin(localStorage)
.use(router)
.mount('#app')
