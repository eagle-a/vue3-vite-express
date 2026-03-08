<template>
    <div class="main">
        <div class="main-left">
            <!-- 子导航 - Material 3 风格 -->
            <nav class="tools-nav glass">
                <div class="nav-title">
                    <i class="icon icon-toolbox" />
                    <span>工具箱</span>
                </div>
                <div class="nav-links">
                    <router-link 
                        to="/tools" 
                        exact 
                        class="nav-link"
                        active-class="active"
                    >
                        <i class="icon icon-grid" />
                        <span>全部工具</span>
                    </router-link>
                    <router-link 
                        to="/tools/matrix" 
                        class="nav-link"
                        active-class="active"
                    >
                        <i class="icon icon-matrix" />
                        <span>矩阵运算</span>
                    </router-link>
                    <router-link 
                        to="/tools/wordcount" 
                        class="nav-link"
                        active-class="active"
                    >
                        <i class="icon icon-text" />
                        <span>字数统计</span>
                    </router-link>
                    <router-link 
                        to="/tools/elaphure" 
                        class="nav-link"
                        active-class="active"
                    >
                        <i class="icon icon-chip" />
                        <span>Elaphure-DAP</span>
                    </router-link>
                </div>
            </nav>

            <!-- 子路由内容 -->
            <router-view v-slot="{ Component }">
                <transition name="slide" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
        <div class="main-right">
            <AsideCategory />
            <AsideOther />
        </div>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'FrontendTools',
})

useHead({
    title: '实用工具',
    meta: [
        { name: 'description', content: '实用工具集合，包括矩阵计算、字数统计等在线工具' },
        { name: 'keywords', content: '工具, 在线工具, 矩阵计算, 字数统计, DAPLink' },
    ],
})
</script>

<style scoped lang="scss">
$primary: #6750A4;
$surface: #FFFBFE;
$on-surface: #1C1B1F;
$outline: #79747E;

@mixin glass-effect {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.5);
}

// 子导航样式
.tools-nav {
    @include glass-effect;
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.nav-title {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid rgba($outline, 0.15);

    i {
        font-size: 28px;
        color: $primary;
    }

    span {
        font-size: 18px;
        font-weight: 600;
        color: $on-surface;
    }
}

.nav-links {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 12px;
    font-size: 14px;
    color: $outline;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 500;

    i {
        font-size: 18px;
    }

    &:hover {
        background: rgba($primary, 0.08);
        color: $primary;
    }

    &.active {
        background: rgba($primary, 0.15);
        color: $primary;
        font-weight: 600;
    }
}

// 路由过渡动画
.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from {
    opacity: 0;
    transform: translateX(20px);
}

.slide-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}

// 响应式
@media (max-width: 768px) {
    .nav-links {
        overflow-x: auto;
        flex-wrap: nowrap;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 8px;
    }

    .nav-link {
        white-space: nowrap;
    }
}
</style>
