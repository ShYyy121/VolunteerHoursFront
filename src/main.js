/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import NavBar from '@/components/NavBar.vue'; // 导入 NavBar 组件
const app = createApp(App)
app.component('NavBar', NavBar);
registerPlugins(app)

app.mount('#app')
