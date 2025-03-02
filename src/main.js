import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'leaflet/dist/leaflet.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'arabian',
    themes: {
      arabian: {
        dark: false,
        colors: {
          primary: '#C19A6B',   // Sandy gold
          secondary: '#8B4513', // Saddle brown (darker accent)
          accent: '#D4AF37',    // Metallic gold
          error: '#B71C1C',     // Dark red
          info: '#0288D1',      // Turquoise blue
          success: '#388E3C',   // Dark green
          warning: '#F57F17',   // Amber
          background: '#F5E8D3', // Light beige
        }
      }
    }
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')