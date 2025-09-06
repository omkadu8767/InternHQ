import Vue from 'vue';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import 'vuetify/dist/vuetify.min.css';
import Vuetify from 'vuetify/lib';
import App from './App.vue';
import router from './router';
import { auth } from './store/auth';

Vue.use(Vuetify);
const vuetify = new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#1E88E5', // Bright Blue → primary brand
        accent: '#00E5FF', // Neon Cyan → glowing accents
        secondary: '#121212', // True Black → app background
        info: '#29B6F6', // Sky Blue
        warning: '#FFCA28', // Amber
        error: '#EF5350', // Red
        success: '#66BB6A', // Green
        background: '#0D1117', // Deep dark gray background
        surface: '#1F1F1F', // Dark card surface


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
