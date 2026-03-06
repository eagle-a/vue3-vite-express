<template>
    <div class="main-container">
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
} from '@/components'

defineOptions({
    name: 'PagePlaceholder',
})
</script>

<style scoped>
.main-container {
    min-height: 100vh;
    background: var(--color-background);
}

.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 24px 40px;
}

@media (max-width: 768px) {
    .main-content {
        padding: 70px 16px 24px;
    }
}
</style>
