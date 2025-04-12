/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import 'element-plus/dist/index.css'
// Types
import type { App } from 'vue'
import ElementPlus from 'element-plus';
export function registerPlugins (app: App) {
  app.use(vuetify)
  app.use(ElementPlus)
}
