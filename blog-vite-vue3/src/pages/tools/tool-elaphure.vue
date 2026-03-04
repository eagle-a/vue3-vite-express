<template>
    <div class="elaphure-tool">
        <el-tabs v-model="activeTab" type="border-card" class="elaphure-tabs">
            <!-- 介绍页 -->
            <el-tab-pane label="项目介绍" name="intro">
                <!-- 项目介绍卡片 -->
                <div class="project-header glass">
                    <div class="project-logo">
                        <i class="icon icon-chip" />
                    </div>
                    <div class="project-info">
                        <h1>Elaphure-DAP</h1>
                        <p class="subtitle">开源 DAPLink 调试器 / 免驱 CMSIS-DAP 下载器</p>
                        <div class="project-tags">
                            <span class="tag primary">开源硬件</span>
                            <span class="tag">CMSIS-DAP</span>
                            <span class="tag">免驱</span>
                            <span class="tag">低成本</span>
                        </div>
                    </div>
                    <div class="project-actions">
                        <a 
                            href="https://github.com/windowsair/elaphure-dap" 
                            target="_blank" 
                            class="btn btn-github"
                        >
                            <i class="icon icon-github" />
                            GitHub
                        </a>
                        <a 
                            href="https://gitee.com/windowsair/elaphure-dap" 
                            target="_blank" 
                            class="btn btn-gitee"
                        >
                            <i class="icon icon-gitee" />
                            Gitee
                        </a>
                    </div>
                </div>

                <!-- 特性展示 -->
                <div class="features-container">
                    <div class="feature-card glass">
                        <div class="feature-header">
                            <div class="feature-icon purple">
                                <i class="icon icon-lightning" />
                            </div>
                            <h3>即插即用</h3>
                        </div>
                        <p>无需安装驱动，Windows / macOS / Linux 全平台支持</p>
                    </div>

                    <div class="feature-card glass">
                        <div class="feature-header">
                            <div class="feature-icon blue">
                                <i class="icon icon-speed" />
                            </div>
                            <h3>高性能</h3>
                        </div>
                        <p>支持 SWD / JTAG 接口，最高 30MHz 调试速度</p>
                    </div>

                    <div class="feature-card glass">
                        <div class="feature-header">
                            <div class="feature-icon green">
                                <i class="icon icon-dollar" />
                            </div>
                            <h3>低成本</h3>
                        </div>
                        <p>仅需几元成本，轻松 DIY 自己的调试器</p>
                    </div>

                    <div class="feature-card glass">
                        <div class="feature-header">
                            <div class="feature-icon orange">
                                <i class="icon icon-code" />
                            </div>
                            <h3>开源</h3>
                        </div>
                        <p>完整开源硬件设计，可自由修改和商用</p>
                    </div>
                </div>

                <!-- 技术规格 -->
                <div class="specs-section glass">
                    <h2 class="section-title">
                        <i class="icon icon-list" />
                        技术规格
                    </h2>
                    <div class="specs-grid">
                        <div class="spec-item">
                            <span class="spec-label">目标接口</span>
                            <span class="spec-value">SWD / JTAG</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">调试协议</span>
                            <span class="spec-value">CMSIS-DAP v2</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">最大速度</span>
                            <span class="spec-value">30 MHz</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">USB 接口</span>
                            <span class="spec-value">USB 2.0 Full Speed</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">目标电压</span>
                            <span class="spec-value">1.8V - 5.5V</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">保护功能</span>
                            <span class="spec-value">过流保护、ESD 保护</span>
                        </div>
                    </div>
                </div>

                <!-- 支持的工具 -->
                <div class="tools-section glass">
                    <h2 class="section-title">
                        <i class="icon icon-tools" />
                        支持的工具
                    </h2>
                    <div class="tools-list">
                        <div class="tool-item">
                            <i class="icon icon-keil" />
                            <span>Keil MDK</span>
                        </div>
                        <div class="tool-item">
                            <i class="icon icon-iar" />
                            <span>IAR EWARM</span>
                        </div>
                        <div class="tool-item">
                            <i class="icon icon-vscode" />
                            <span>VS Code + Cortex-Debug</span>
                        </div>
                        <div class="tool-item">
                            <i class="icon icon-pyocd" />
                            <span>PyOCD</span>
                        </div>
                        <div class="tool-item">
                            <i class="icon icon-openocd" />
                            <span>OpenOCD</span>
                        </div>
                    </div>
                </div>

                <!-- 使用说明 -->
                <div class="guide-section glass">
                    <h2 class="section-title">
                        <i class="icon icon-book" />
                        快速开始
                    </h2>
                    <div class="guide-steps">
                        <div class="step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>获取硬件</h4>
                                <p>从 GitHub 下载 PCB 设计文件，或在淘宝购买成品</p>
                            </div>
                        </div>
                        <div class="step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>连接目标板</h4>
                                <p>使用 SWD 线连接调试器和目标开发板</p>
                            </div>
                        </div>
                        <div class="step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>开始调试</h4>
                                <p>在 IDE 中选择 CMSIS-DAP 调试器即可使用</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 相关链接 -->
                <div class="links-section">
                    <a href="https://github.com/windowsair/elaphure-dap" target="_blank" class="link-card glass">
                        <i class="icon icon-github" />
                        <div>
                            <h4>GitHub 仓库</h4>
                            <p>查看源代码和设计文件</p>
                        </div>
                    </a>
                    <a href="https://gitee.com/windowsair/elaphure-dap" target="_blank" class="link-card glass">
                        <i class="icon icon-gitee" />
                        <div>
                            <h4>Gitee 镜像</h4>
                            <p>国内访问更快</p>
                        </div>
                    </a>
                </div>
            </el-tab-pane>

            <!-- 在线烧录页 -->
            <el-tab-pane label="在线烧录" name="flash">
                <div class="flash-tool-container">
                    <div class="flash-main">
                        <!-- 固件上传 -->
                        <div class="flash-section glass">
                            <h3 class="section-subtitle">
                                <i class="icon icon-upload" />
                                固件上传
                            </h3>
                            <FirmwareUpload />
                        </div>

                        <!-- 设备连接 -->
                        <div class="flash-section glass">
                            <h3 class="section-subtitle">
                                <i class="icon icon-usb" />
                                设备连接
                            </h3>
                            <DeviceConnect />
                        </div>

                        <!-- 烧录配置 -->
                        <div class="flash-section glass">
                            <h3 class="section-subtitle">
                                <i class="icon icon-settings" />
                                烧录配置
                            </h3>
                            <FlashConfig />
                        </div>

                        <!-- 操作按钮 -->
                        <div class="flash-actions">
                            <el-button 
                                type="primary" 
                                size="large" 
                                :disabled="!isDeviceConnect || !firmwareFile || isStart"
                                :loading="isStart"
                                @click="onDownload"
                            >
                                <i class="icon icon-play" />
                                {{ isStart ? '烧录中...' : '开始烧录' }}
                            </el-button>
                            <el-button 
                                size="large" 
                                @click="clearLog"
                            >
                                <i class="icon icon-clear" />
                                清空日志
                            </el-button>
                        </div>
                    </div>

                    <!-- 日志输出 -->
                    <div class="flash-log glass">
                        <h3 class="section-subtitle">
                            <i class="icon icon-terminal" />
                            操作日志
                        </h3>
                        <pre class="log-content">{{ dapLogText || '等待操作...' }}</pre>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DeviceConnect from '~/components/elaphure/DeviceConnect.vue'
import FirmwareUpload from '~/components/elaphure/FirmwareUpload.vue'
import FlashConfig from '~/components/elaphure/FlashConfig.vue'
import { isDeviceConnect, firmwareFile, isStart } from '~/components/elaphure/dap/config'
import { dapLogText, clearLog } from '~/components/elaphure/dap/log'
import { onDownload } from '~/components/elaphure/dap/download'

const activeTab = ref('intro')

useHead({
    title: 'Elaphure-DAP - 开源 DAPLink 调试器',
    meta: [
        { name: 'description', content: 'Elaphure-DAP 是一款开源的 DAPLink 调试器，支持 CMSIS-DAP 协议，免驱使用，低成本高性价比。支持在线烧录固件。' },
        { name: 'keywords', content: 'DAPLink, CMSIS-DAP, 调试器, 开源硬件, SWD, JTAG, 在线烧录' },
    ],
})
</script>

<style scoped lang="scss">
$primary: #6750A4;
$surface: #FEF7FF;
$on-surface: #1D1B20;
$outline: #79747E;

@mixin glass-effect {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.elaphure-tool {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.elaphure-tabs {
    :deep(.el-tabs__header) {
        background: rgba(255, 255, 255, 0.8);
        border-radius: 12px 12px 0 0;
    }

    :deep(.el-tabs__content) {
        background: transparent;
        padding: 20px 0;
    }
}

// 项目介绍样式
.project-header {
    @include glass-effect;
    border-radius: 20px;
    padding: 32px;
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 24px;
}

.project-logo {
    width: 100px;
    height: 100px;
    border-radius: 24px;
    background: linear-gradient(135deg, $primary 0%, #9C27B0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    color: white;
    flex-shrink: 0;
}

.project-info {
    flex: 1;

    h1 {
        font-size: 32px;
        font-weight: 600;
        margin: 0 0 8px;
        background: linear-gradient(135deg, $primary 0%, #9C27B0 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .subtitle {
        font-size: 16px;
        color: $outline;
        margin: 0 0 16px;
    }
}

.project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .tag {
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 13px;
        background: rgba($primary, 0.1);
        color: $primary;

        &.primary {
            background: $primary;
            color: white;
        }
    }
}

.project-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.3s ease;

        i {
            font-size: 18px;
        }
    }

    .btn-github {
        background: #24292e;
        color: white;

        &:hover {
            background: #2f363d;
        }
    }

    .btn-gitee {
        background: #C71D23;
        color: white;

        &:hover {
            background: #d4353b;
        }
    }
}

// 特性卡片
.features-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}

.feature-card {
    @include glass-effect;
    border-radius: 16px;
    padding: 24px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .feature-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
    }

    .feature-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;

        &.purple {
            background: linear-gradient(135deg, #E8D5F9 0%, #D4B5F0 100%);
            color: #7B1FA2;
        }

        &.blue {
            background: linear-gradient(135deg, #B3E5FC 0%, #81D4FA 100%);
            color: #0277BD;
        }

        &.green {
            background: linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%);
            color: #2E7D32;
        }

        &.orange {
            background: linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%);
            color: #EF6C00;
        }
    }

    h3 {
        font-size: 16px;
        font-weight: 600;
        color: $on-surface;
        margin: 0;
    }

    p {
        font-size: 14px;
        color: $outline;
        margin: 0;
        line-height: 1.5;
    }
}

// 技术规格
.specs-section {
    @include glass-effect;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    color: $on-surface;
    margin: 0 0 16px;
    display: flex;
    align-items: center;
    gap: 8px;

    i {
        color: $primary;
    }
}

.section-subtitle {
    font-size: 16px;
    font-weight: 600;
    color: $on-surface;
    margin: 0 0 16px;
    display: flex;
    align-items: center;
    gap: 8px;

    i {
        color: $primary;
    }
}

.specs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}

.spec-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px 16px;
    background: rgba($primary, 0.05);
    border-radius: 12px;

    .spec-label {
        font-size: 12px;
        color: $outline;
    }

    .spec-value {
        font-size: 14px;
        font-weight: 500;
        color: $on-surface;
    }
}

// 支持的工具
.tools-section {
    @include glass-effect;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
}

.tools-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.tool-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: rgba($primary, 0.05);
    border-radius: 12px;
    font-size: 14px;
    color: $on-surface;

    i {
        font-size: 20px;
        color: $primary;
    }
}

// 使用说明
guide-section {
    @include glass-effect;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
}

.guide-steps {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.step {
    display: flex;
    gap: 16px;
}

.step-number {
    width: 36px;
    height: 36px;
    background: $primary;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 600;
    flex-shrink: 0;
}

.step-content {
    flex: 1;
    padding-top: 6px;

    h4 {
        font-size: 15px;
        font-weight: 600;
        color: $on-surface;
        margin: 0 0 4px;
    }

    p {
        font-size: 13px;
        color: $outline;
        margin: 0;
    }
}

// 相关链接
.links-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin-top: 24px;
}

.link-card {
    @include glass-effect;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    i {
        font-size: 28px;
        color: $primary;
    }

    h4 {
        font-size: 15px;
        font-weight: 600;
        color: $on-surface;
        margin: 0 0 4px;
    }

    p {
        font-size: 12px;
        color: $outline;
        margin: 0;
    }
}

// 烧录工具样式
.flash-tool-container {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 20px;

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
}

.flash-main {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.flash-section {
    @include glass-effect;
    border-radius: 16px;
    padding: 20px;
}

.flash-actions {
    display: flex;
    gap: 12px;
    margin-top: 8px;

    .el-button {
        flex: 1;
    }
}

.flash-log {
    @include glass-effect;
    border-radius: 16px;
    padding: 20px;
    height: fit-content;
    max-height: 600px;
    overflow: hidden;

    .log-content {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 8px;
        padding: 16px;
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 13px;
        line-height: 1.6;
        color: $on-surface;
        white-space: pre-wrap;
        word-break: break-all;
        min-height: 300px;
        max-height: 500px;
        overflow-y: auto;
        margin: 0;
    }
}

// 图标样式
.icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

// 响应式
@media (max-width: 768px) {
    .project-header {
        flex-direction: column;
        text-align: center;
        padding: 24px;
    }

    .project-logo {
        width: 80px;
        height: 80px;
        font-size: 40px;
    }

    .project-info h1 {
        font-size: 24px;
    }

    .project-actions {
        flex-direction: row;
        justify-content: center;
        width: 100%;
    }

    .features-container {
        grid-template-columns: 1fr;
    }

    .specs-grid {
        grid-template-columns: 1fr;
    }

    .tools-list {
        justify-content: center;
    }

    .flash-tool-container {
        grid-template-columns: 1fr;
    }

    .flash-log {
        max-height: none;
    }
}
</style>
