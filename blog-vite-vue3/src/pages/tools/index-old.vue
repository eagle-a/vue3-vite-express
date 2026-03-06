<template>
    <div class="tools-home">
        <!-- 欢迎卡片 - 玻璃拟态 -->
        <div class="welcome-card glass">
            <div class="welcome-content">
                <div class="welcome-icon">
                    <i class="icon icon-toolbox" />
                </div>
                <div class="welcome-text">
                    <h2>欢迎来到工具箱</h2>
                    <p>选择下方工具开始使用，所有工具均在本地运行，保护您的隐私</p>
                </div>
            </div>
        </div>

        <!-- 工具网格 - Material 3 卡片 -->
        <div class="tools-grid">
            <router-link 
                v-for="tool in tools" 
                :key="tool.path"
                :to="tool.path"
                class="tool-card"
            >
                <div class="card-glass">
                    <div class="card-icon" :style="{ background: tool.color }">
                        <i :class="tool.icon" />
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">{{ tool.name }}</h3>
                        <p class="card-desc">{{ tool.description }}</p>
                        <div class="card-tags">
                            <span v-for="tag in tool.tags" :key="tag" class="tag">
                                {{ tag }}
                            </span>
                        </div>
                    </div>
                    <div class="card-arrow">
                        <i class="icon icon-arrow-right" />
                    </div>
                </div>
            </router-link>
        </div>

        <!-- 特性说明 -->
        <div class="features-section">
            <h3 class="section-title">设计特点</h3>
            <div class="features-grid">
                <div class="feature-item glass">
                    <i class="icon icon-shield" />
                    <h4>隐私优先</h4>
                    <p>所有计算均在本地完成，无需联网</p>
                </div>
                <div class="feature-item glass">
                    <i class="icon icon-bolt" />
                    <h4>即时响应</h4>
                    <p>采用现代 Web 技术，毫秒级响应</p>
                </div>
                <div class="feature-item glass">
                    <i class="icon icon-mobile" />
                    <h4>移动适配</h4>
                    <p>完美适配手机和平板设备</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const tools = [
    {
        path: '/tools/matrix',
        name: '矩阵运算',
        description: '三阶矩阵求逆计算器，支持分数和整数运算，实时显示计算步骤',
        icon: 'icon icon-matrix',
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        tags: ['数学', '计算器', '教育'],
    },
    {
        path: '/tools/wordcount',
        name: '字数统计',
        description: '智能统计文本字数、字符数、段落数，支持中英文混合统计',
        icon: 'icon icon-text',
        color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        tags: ['文本', '写作', '办公'],
    },
    {
        path: '/tools/elaphure',
        name: 'Elaphure-DAP',
        description: '开源 DAPLink 调试器项目，支持 CMSIS-DAP 协议，免驱使用',
        icon: 'icon icon-chip',
        color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        tags: ['硬件', '调试', '开源'],
    },
]
</script>

<style scoped lang="scss">
$primary: #6750A4;
$on-surface: #1C1B1F;
$outline: #79747E;

@mixin glass-effect {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.5);
}

.tools-home {
    animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

// 欢迎卡片
.welcome-card {
    @include glass-effect;
    border-radius: 24px;
    padding: 32px;
    margin-bottom: 32px;
    box-shadow: 0 8px 32px rgba(103, 80, 164, 0.1);
}

.welcome-content {
    display: flex;
    align-items: center;
    gap: 24px;
}

.welcome-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, $primary 0%, #9C27B0 100%);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    color: white;
    flex-shrink: 0;
    box-shadow: 0 8px 24px rgba($primary, 0.3);
}

.welcome-text {
    h2 {
        font-size: 24px;
        font-weight: 500;
        color: $on-surface;
        margin: 0 0 8px;
    }

    p {
        font-size: 16px;
        color: $outline;
        margin: 0;
        line-height: 1.5;
    }
}

// 工具网格
.tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.tool-card {
    text-decoration: none;
    display: block;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-4px);

        .card-arrow {
            transform: translateX(4px);
        }
    }
}

.card-glass {
    @include glass-effect;
    border-radius: 20px;
    padding: 24px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.3s ease;

    &:hover {
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    }
}

.card-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: white;
    flex-shrink: 0;
}

.card-content {
    flex: 1;
}

.card-title {
    font-size: 18px;
    font-weight: 500;
    color: $on-surface;
    margin: 0 0 8px;
}

.card-desc {
    font-size: 14px;
    color: $outline;
    margin: 0 0 12px;
    line-height: 1.5;
}

.card-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.tag {
    font-size: 11px;
    padding: 4px 10px;
    background: rgba($primary, 0.1);
    color: $primary;
    border-radius: 12px;
    font-weight: 500;
}

.card-arrow {
    font-size: 20px;
    color: $outline;
    transition: transform 0.3s ease;
}

// 特性区域
.features-section {
    margin-top: 48px;
}

.section-title {
    font-size: 20px;
    font-weight: 500;
    color: $on-surface;
    margin: 0 0 24px;
    text-align: center;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}

.feature-item {
    @include glass-effect;
    border-radius: 16px;
    padding: 24px;
    text-align: center;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-4px);
    }

    i {
        font-size: 32px;
        color: $primary;
        margin-bottom: 12px;
        display: block;
    }

    h4 {
        font-size: 16px;
        font-weight: 500;
        color: $on-surface;
        margin: 0 0 8px;
    }

    p {
        font-size: 13px;
        color: $outline;
        margin: 0;
        line-height: 1.5;
    }
}

// 响应式
@media (max-width: 768px) {
    .welcome-card {
        padding: 24px;
    }

    .welcome-content {
        flex-direction: column;
        text-align: center;
    }

    .welcome-icon {
        width: 64px;
        height: 64px;
        font-size: 32px;
    }

    .welcome-text h2 {
        font-size: 20px;
    }

    .tools-grid {
        grid-template-columns: 1fr;
    }

    .card-glass {
        padding: 20px;
    }
}
</style>
