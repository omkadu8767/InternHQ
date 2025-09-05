import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/dist/vuetify.min.css';
import router from './router';
import { auth } from './store/auth';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

Vue.use(Vuetify);
const vuetify = new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#3F51B5', // Indigo
        accent: '#00B8D4',  // Pink A200
        secondary: '#424242',
        info: '#2196F3',
        warning: '#FFC107',
        error: '#FF5252',
        success: '#4CAF50'
      }
    }
  }
});

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
