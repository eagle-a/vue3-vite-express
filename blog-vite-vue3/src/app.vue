<template>
    <div :class="backend ? 'backend' : 'frontend'">
        <Navbar v-if="!backend" />
        <router-view class="app-view relative" />
        <BackToTop :visibility-height="100" />
        <client-only>
            <reload-prompt />
        </client-only>
    </div>
</template>

<script setup lang="ts">
import { parseCookies } from '@lincy/utils'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { toRefs, ref, computed } from 'vue'
import type { UserCookies } from './types'
import useGlobalStore from './app/store/use-global-store'
import useAppShellStore from './app/store/use-app-shell-store'
import Navbar from '@/components/layout/Navbar.vue'
import BackToTop from '@/components/BackToTop.vue'

defineOptions({
    name: 'AppRoot',
})

// pinia 状态管理 ===>
const globalStore = useGlobalStore()
const { showLoginModal, showRegisterModal } = toRefs(globalStore)

let cookies = {} as UserCookies
if (typeof document !== 'undefined') {
    cookies = parseCookies(document.cookie) as UserCookies
    cookies.username = decodeURIComponent(cookies.username || '')
    globalStore.setCookies(cookies)
}

const appShellStore = useAppShellStore()
const { pageTransitionName } = storeToRefs(appShellStore)

// const isSSR = ref(!!import.meta.env.SSR)
// const isPROD = ref(!!import.meta.env.PROD)

const cacheFrontendComponents = ref('frontend-index,frontend-about')
// const cacheBackendComponents = ref('backend-admin-list,backend-article-list,backend-user-list')

const route = useRoute()
const key = computed(() => {
    const path = (route.meta.path as string) || route.path
    return path.replace(/\//g, '_')
})
const backend = computed(() => {
    return route.path.includes('backend')
})

function handleBeforeEnter() {
    appShellStore.setPageSwitching(true)
}

function handleAfterEnter() {
    appShellStore.setPageSwitching(false)
}
</script>
