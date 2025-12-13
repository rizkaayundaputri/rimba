import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { createPinia } from 'pinia'
import './libraries/http.js'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { useAuthStore } from './stores/authStore';

const pinia = createPinia()
const app = createApp(App)
 app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
  });

  app.use(pinia)

  const authStore = useAuthStore()
  authStore.initAuth()  // init token + fetch user data
  // kalau tidak ada ini kemunkinan request axios tidak ada tokennya
  //Dynamic routes dari DB mungkin belum dimuat saat router guard dijalankan →
  //accessibleModules masih kosong → redirect ke modul pertama user bisa gagal.
  //User login bisa diarahkan ke route yang belum ada → halaman blank atau error “route not found”.
  // Dengan kata lain: bisa jalan, tapi risikonya: login & redirect modul pertama tidak 100% aman. Kadang user bisa tetap diarahkan ke login atau halaman modul tidak muncul karena routes belum ditambahkan.

  app.component('Card', Card)
  app.component('InputText', InputText)
  app.component('Password', Password)
  app.component('Button', Button)
  app.use(router)
  app.mount('#app')
