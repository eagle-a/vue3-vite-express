<template>
    <div class="main-container">
        <Navbar>
            <template #brand>
                <span class="brand-logo">湛明博客 - 后台管理</span>
            </template>
            <template #menu>
                <router-link to="/admin" class="nav-link">首页</router-link>
            </template>
            <template #actions>
                <ThemeToggle />
            </template>
        </Navbar>

        <main class="main-content">
            <router-view v-slot="{ Component }">
                <Suspense>
                    <component :is="Component" />
                </Suspense>
            </router-view>
        </main>

        <BackToTop :visibility-height="100" />
    </div>
</template>

<script setup lang="ts">
import {
    BackToTop,
    Navbar,
    ThemeToggle,
} from '@/components'

defineOptions({
    name: 'BackendManagePage',
})
</script>

<style scoped>
.main-container {
    min-height: 100vh;
    background: var(--color-background);
}

.main-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 80px 24px 40px;
}

@media (max-width: 768px) {
    .main-content {
        padding: 70px 16px 24px;
    }
}
</style>
