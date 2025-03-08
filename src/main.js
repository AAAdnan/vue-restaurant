// src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './store/auth';

import './firebase';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

// Define your Vuetify theme
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#8B4513', // Brown - for the souk/bazaar theme
          secondary: '#D4AF37', // Gold
          accent: '#5D4037', // Darker brown
          error: '#B71C1C',
          info: '#0D47A1',
          success: '#1B5E20',
          warning: '#F57F17',
        },
      },
    },
  },
});

// Create app with plugins
const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(vuetify);

// Initialize auth store
const authStore = useAuthStore();

// Wait for auth initialization before mounting the app
authStore.initAuth()
  .then(() => {
    console.log('Auth initialized, mounting app');
    app.use(router);
    app.mount('#app');
  })
  .catch(error => {
    console.error('Auth initialization failed, mounting app anyway:', error);
    app.use(router);
    app.mount('#app');
  });