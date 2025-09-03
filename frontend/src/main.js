import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import { auth } from './store/auth';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

Vue.mixin({
  computed: {
    $auth() { return auth; }
  }
});
Vue.use(Toast, {
  // Optional: Global options for all toasts
  timeout: 3000,
  position: 'top-right',
  // ... other options
});


Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
