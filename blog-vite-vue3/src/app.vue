<template>
    <div :class="backend ? 'backend' : 'frontend'">
        <Navbar v-if="!backend">
            <template #brand>
                <span class="brand-logo">湛明博客</span>
            </template>
            <template #menu>
                <router-link to="/" class="nav-link">首页</router-link>
                <router-link to="/about" class="nav-link">关于</router-link>
            </template>
            <template #actions>
                <ThemeToggle />
                <BaseButton size="sm" @click="showLoginModal = true">登录</BaseButton>
            </template>
        </Navbar>
        <router-view v-slot="{ Component }" class="app-view relative">
            <transition :name="pageTransitionName" mode="out-in" @before-enter="handleBeforeEnter" @after-enter="handleAfterEnter">
                <keep-alive :key="key" :include="cacheFrontendComponents">
                    <Suspense>
                        <component :is="Component" :key="key" />
                    </Suspense>
                </keep-alive>
            </transition>
        </router-view>
        <BackToTop :visibility-height="100" />
        <client-only>
            <reload-prompt />
        </client-only>
    </div>
</template>

<script setup lang="ts">
import { parseCookies } from '@lincy/utils'
import type { UserCookies } from './types'
import {
    Navbar,
    ThemeToggle,
    BaseButton,
    BackToTop,
} from '@/components'

defineOptions({
    name: 'AppRoot',
})

// pinia 状态管理 ===>
const globalStore = useGlobalStore()
const { showLoginModal, showRegisterModal } = toRefs(globalStore)

const cookies = parseCookies(document.cookie) as UserCookies
cookies.username = decodeURIComponent(cookies.username || '')
globalStore.setCookies(cookies)

const appShellStore = useAppShellStore()
const { pageTransitionName } = storeToRefs(appShellStore)

// const isSSR = ref(!!import.meta.env.SSR)
// const isPROD = ref(!!import.meta.env.PROD)

const cacheFrontendComponents = $ref('frontend-index,frontend-about')
// const cacheBackendComponents = ref('backend-admin-list,backend-article-list,backend-user-list')

const route = useRoute()
const key = $computed(() => {
    const path = (route.meta.path as string) || route.path
    return path.replace(/\//g, '_')
})
const backend = $computed(() => {
    return route.path.includes('backend')
})

function handleBeforeEnter() {
    appShellStore.setPageSwitching(true)
}

function handleAfterEnter() {
    appShellStore.setPageSwitching(false)
}
</script>
