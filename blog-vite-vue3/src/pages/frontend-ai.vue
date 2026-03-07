<template>
    <div class="ai-container">
        <Navbar>
            <template #brand>
                <span class="brand-logo">湛明博客 - AI</span>
            </template>
            <template #menu>
                <router-link to="/" class="nav-link">首页</router-link>
                <router-link to="/about" class="nav-link">关于</router-link>
            </template>
            <template #actions>
                <ThemeToggle />
            </template>
        </Navbar>

        <main class="ai-main">
            <div class="chat-container">
                <div class="messages-area">
                    <div class="messages-list">
                        <div
                            v-for="(message, index) in messages"
                            :key="index"
                            class="message-item"
                            :class="message.role"
                        >
                            <GlassPanel class="message-bubble" :blur="16">
                                <div class="message-header">
                                    <span class="message-role">{{ message.role === 'user' ? '你' : modelName }}</span>
                                    <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                                </div>
                                <div class="message-content">
                                    <span v-if="message.role === 'user'">{{ message.content }}</span>
                                    <div v-else v-html="processedContent(message.content)"></div>
                                </div>
                            </GlassPanel>
                        </div>
                    </div>
                </div>

                <div class="input-area">
                    <GlassPanel class="input-panel" :blur="20" :opacity="0.95">
                        <div class="input-header mb-2">
                            <div class="model-selector">
                                <el-dropdown :max-height="200" popper-class="model-dropdown-popper" @command="handleModelChange">
                                    <span class="el-dropdown-link flex items-center gap-2 cursor-pointer">
                                        <el-icon><Monitor /></el-icon>
                                        <span>{{ modelName }}</span>
                                        <el-icon><ArrowDown /></el-icon>
                                    </span>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item
                                                v-for="item in modelList"
                                                :key="item.id"
                                                :command="item.id"
                                            >
                                                {{ item.name }}
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                                <span
                                    class="thinking-toggle"
                                    :class="{ active: enableThinking }"
                                    @click="enableThinking = !enableThinking"
                                >
                                    思考: {{ enableThinking ? '开' : '关' }}
                                </span>
                                <span class="new-chat-btn" @click="clearMessages">
                                    新对话
                                </span>
                            </div>
                            <div class="input-hint">
                                <span>按 Enter 发送</span>
                            </div>
                        </div>
                        <div class="input-wrapper">
                            <textarea
                                v-model="userInput"
                                placeholder="输入消息..."
                                class="message-input"
                                @keydown.enter.ctrl="sendMessage"
                                @keydown.enter.exact.prevent="sendMessage"
                                rows="1"
                            />
                            <BaseButton
                                :loading="isLoading"
                                :disabled="!userInput.trim()"
                                @click="sendMessage"
                            >
                                发送
                            </BaseButton>
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </main>

        <BackToTop :visibility-height="100" />
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import {
    Navbar,
    ThemeToggle,
    GlassPanel,
    BaseButton,
    BackToTop,
} from '@/components'
import { ElMessage, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { ArrowDown, Monitor } from '@element-plus/icons-vue'

interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

interface Model {
    id: string
    name: string
}

// Coding Plan 支持的模型列表（阿里云 DashScope）
const modelList: Model[] = [
    { id: 'qwen3.5-plus', name: '千问 3.5 Plus' },
    { id: 'qwen3-max-2026-01-23', name: '千问 3 Max' },
    { id: 'qwen3-coder-next', name: '千问 3 Coder Next' },
    { id: 'qwen3-coder-plus', name: '千问 3 Coder Plus' },
    { id: 'glm-5', name: '智谱 GLM-5' },
    { id: 'glm-4.7', name: '智谱 GLM-4.7' },
    { id: 'kimi-k2.5', name: 'Kimi K2.5' },
    { id: 'MiniMax-M2.5', name: 'MiniMax M2.5' },
]

const selectedModelId = ref<string>(modelList[0].id)
const modelName = computed(() => {
    const found = modelList.find(item => item.id === selectedModelId.value)
    return found?.name || selectedModelId.value
})

const messages = ref<Message[]>([])
const userInput = ref('')
const isLoading = ref(false)
const enableThinking = ref(false)

const scrollToBottom = async () => {
    await nextTick()
    const messagesArea = document.querySelector('.messages-area')
    if (messagesArea) {
        messagesArea.scrollTop = messagesArea.scrollHeight
    }
}

const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

// 处理 <think>...</think> 标签，将推理内容显示为小字
const processThinkContent = (content: string): string => {
    const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/)
    if (thinkMatch) {
        const thinkContent = thinkMatch[1]
        const smallThinkContent = `<small style="font-size: 0.8em; color: #6b7280;">${thinkContent}</small>`
        return content.replace(thinkMatch[0], smallThinkContent)
    }
    return content
}

const processedContent = (content: string): string => {
    return processThinkContent(content)
}

// 处理推理内容（reasoning_content）
const processReasoningContent = (content: string): string => {
    return `<small style="font-size: 0.8em; color: #6b7280;">${content}</small>`
}

const clearMessages = () => {
    messages.value = []
    messages.value.push({
        role: 'assistant',
        content: '你好！我是湛明 AI 助手，有什么可以帮助你的吗？',
        timestamp: new Date()
    })
    ElMessage.success('已开始新对话')
}

const sendMessage = async () => {
    if (!userInput.value.trim() || isLoading.value) {
        return
    }

    const userMessage: Message = {
        role: 'user',
        content: userInput.value.trim(),
        timestamp: new Date()
    }

    messages.value.push(userMessage)
    userInput.value = ''
    isLoading.value = true

    await scrollToBottom()

    try {
        // 调用后端 API（流式模式）
        const response = await fetch('/api/app/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream',
            },
body: JSON.stringify({
                model: selectedModelId.value,
                messages: messages.value.map(m => ({
                    role: m.role,
                    content: m.content
                })),
                stream: true,
                thinking: enableThinking.value
            })
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(`API 请求失败：${response.status} - ${errorData.message || response.statusText}`)
        }

        // 添加空的 AI 消息容器
        const aiMessageIndex = messages.value.length
        messages.value.push({
            role: 'assistant',
            content: '',
            timestamp: new Date()
        })

        // 处理流式响应
        const reader = response.body?.getReader()
        if (!reader) {
            throw new Error('无法读取响应流')
        }

        const decoder = new TextDecoder('utf-8')
        let buffer = ''

        while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
                const trimmedLine = line.trim()
                if (!trimmedLine || !trimmedLine.startsWith('data:')) continue
                if (trimmedLine === 'data: [DONE]') continue

                try {
                    const json = JSON.parse(trimmedLine.slice(6))
                    const delta = json.choices?.[0]?.delta

                    if (delta?.content) {
                        messages.value[aiMessageIndex].content += delta.content
                        await scrollToBottom()
                    }
                }
                catch (e) {
                    console.warn('解析 SSE 数据失败:', e)
                }
            }
        }
    }
    catch (error) {
        console.error('Error sending message:', error)
        const errorMessage: Message = {
            role: 'assistant',
            content: `抱歉，发生了一个错误：${error instanceof Error ? error.message : '未知错误'}`,
            timestamp: new Date()
        }
        messages.value.push(errorMessage)
        ElMessage.error('发送消息失败')
    }
    finally {
        isLoading.value = false
        await scrollToBottom()
    }
}

const handleModelChange = (command: string) => {
    selectedModelId.value = command
    ElMessage.success(`已切换到 ${modelName.value}`)
}

onMounted(() => {
    // 添加欢迎消息
    messages.value.push({
        role: 'assistant',
        content: '你好！我是湛明 AI 助手，有什么可以帮助你的吗？',
        timestamp: new Date()
    })
})

const headTitle = ref('AI 对话 - 湛明')
useHead({
    title: headTitle,
    meta: [
        {
            name: 'description',
            content: 'AI 对话助手',
        },
    ],
})
</script>

<style scoped>
.ai-container {
    min-height: 100vh;
    background: var(--color-background);
    display: flex;
    flex-direction: column;
}

.ai-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-top: 60px;
}

.chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    position: relative;
}

.messages-area {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    padding-bottom: 100px;
}

.messages-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.message-item {
    display: flex;
}

.message-item.user {
    justify-content: flex-end;
}

.message-item.assistant {
    justify-content: flex-start;
}

.message-bubble {
    max-width: 70%;
    padding: 16px;
    min-width: 200px;
}

.message-item.user .message-bubble {
    background: var(--color-primary);
}

.message-item.assistant .message-bubble {
    background: var(--color-surface);
}

.message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--color-surface-variant);
}

.message-item.user .message-header {
    border-bottom-color: rgba(0, 0, 0, 0.1);
}

.message-role {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-primary);
}

.message-item.user .message-role {
    color: #000000;
}

.message-time {
    font-size: 11px;
    color: var(--color-text-hint);
}

.message-item.user .message-time {
    color: rgba(0, 0, 0, 0.5);
}

.message-content {
    font-size: 14px;
    line-height: 1.6;
    color: var(--color-text-primary);
    white-space: pre-wrap;
    word-wrap: break-word;
}

.message-item.user .message-content {
    color: #000000;
}

.input-area {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px 24px 24px;
    background: var(--color-background);
    border-top: 1px solid var(--color-surface-variant);
    z-index: 10;
}

.input-panel {
    padding: 16px;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
}

.input-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.model-selector {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 12px;
}

.el-dropdown-link {
    padding: 6px 14px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 16px;
    background: var(--color-surface-variant);
    color: var(--color-text-secondary);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
}

.el-dropdown-link:hover {
    background: var(--color-primary);
    color: #000000;
    box-shadow: var(--shadow-sm);
}

.el-dropdown-link:active {
    transform: scale(0.96);
}

[data-theme='dark'] .el-dropdown-link:hover {
    background: var(--color-primary);
    color: #000000;
}

.thinking-toggle {
    padding: 6px 14px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 16px;
    cursor: pointer;
    background: var(--color-surface-variant);
    color: var(--color-text-secondary);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
}

.thinking-toggle:hover {
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
}

.thinking-toggle.active {
    background: var(--color-primary);
    color: #000000;
}

.thinking-toggle.active:hover {
    background: var(--color-primary-light);
    box-shadow: var(--shadow-md);
}

.new-chat-btn {
    padding: 6px 14px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 16px;
    cursor: pointer;
    background: var(--color-surface-variant);
    color: var(--color-text-secondary);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
}

.new-chat-btn:hover {
    background: #ef4444;
    color: #ffffff;
    box-shadow: var(--shadow-sm);
}

.new-chat-btn:active {
    transform: scale(0.96);
}

[data-theme='dark'] .new-chat-btn:hover {
    background: #dc2626;
}

.thinking-toggle {
    padding: 6px 14px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 16px;
    cursor: pointer;
    background: var(--color-surface-variant);
    color: var(--color-text-secondary);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
}

.thinking-toggle:hover {
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
}

.thinking-toggle.active {
    background: var(--color-primary);
    color: #000000;
}

.thinking-toggle.active:hover {
    background: var(--color-primary-light);
    box-shadow: var(--shadow-md);
}

.thinking-toggle:active {
    transform: scale(0.96);
}

[data-theme='dark'] .thinking-toggle:hover {
    background: #3a3a3a;
}

[data-theme='dark'] .thinking-toggle.active {
    background: var(--color-primary);
    color: #000000;
}

[data-theme='dark'] .thinking-toggle.active:hover {
    box-shadow: var(--shadow-md);
}

.input-wrapper {
    display: flex;
    gap: 12px;
    align-items: center;
}

.message-input {
    flex: 1;
    min-height: 40px;
    max-height: 120px;
    padding: 10px 16px;
    font-size: 14px;
    line-height: 20px;
    color: var(--color-text-primary);
    background: var(--color-surface);
    border: 1px solid var(--color-surface-variant);
    border-radius: 12px;
    outline: none;
    font-family: inherit;
    transition: border-color 0.2s ease;
    resize: none;
    overflow-y: auto;
    text-align: left;
}

.message-input:focus {
    border-color: var(--color-primary);
}

.message-input::placeholder {
    color: var(--color-text-hint);
    line-height: 20px;
}

.input-hint {
    margin-top: 8px;
    font-size: 12px;
    color: var(--color-text-hint);
    text-align: right;
}

.mb-3 {
    margin-bottom: 12px;
}

.flex {
    display: flex;
}

.items-center {
    align-items: center;
}

.gap-2 {
    gap: 0.5rem;
}

.cursor-pointer {
    cursor: pointer;
}

@media (max-width: 768px) {
    .messages-area {
        padding: 16px;
    }

    .message-bubble {
        max-width: 85%;
        min-width: 150px;
    }

    .input-area {
        padding: 12px 16px 16px;
    }
}
</style>
