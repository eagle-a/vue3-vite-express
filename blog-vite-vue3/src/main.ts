import { createApp as createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue'

import { createRouter } from './app/router'

import App from './app.vue'
import globalPlugin from '@/app/plugins/global'
import '@/assets/design/design-tokens.css'
import '@/assets/design/typography.css'

// SSR 要求每个请求都有一个新的应用程序实例，
// 因此我们导出一个创建新应用程序实例的函数。
export function createApp() {
    const app = createSSRApp(App)
    const store = createPinia()
    const router = createRouter(store)
    const head = createHead()
    app.use(store).use(router).use(head).use(globalPlugin)

    return { app, router, store, head }
}
