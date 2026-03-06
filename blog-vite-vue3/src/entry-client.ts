import { LoadingPlugin } from 'vue-loading-overlay'

import { createApp } from './main'
import reloadPrompt from '@/components/reload-prompt.vue'

import 'uno.css'
import './assets/css/hljs/googlecode.css'
import 'vue-loading-overlay/dist/css/index.css'

const { app, router, store } = createApp()

router.isReady().then(() => {
    app.component('ReloadPrompt', reloadPrompt)
    app.use(LoadingPlugin, {
        'can-cancel': false,
        'loader': 'dots',
        'color': '#54d9e0',
    })
        .mount('#app')
})

if (window.__INITIAL_STATE__) {
    store.state.value = window.__INITIAL_STATE__
}
