<template>
    <div class="ai-container">
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
                                    <span class="message-role">{{ message.role === 'user' ? '你' : 'AI' }}</span>
                                    <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                                </div>
                                <div class="message-content">{{ message.content }}</div>
                            </GlassPanel>
                        </div>
                    </div>
                </div>

                <div class="input-area">
                    <GlassPanel class="input-panel" :blur="20" :opacity="0.95">
                        <div class="input-wrapper">
                            <textarea
                                v-model="userInput"
                                placeholder="输入消息..."
                                class="message-input"
                                rows="1"
                                @keydown.enter.ctrl="sendMessage"
                            />
                            <BaseButton
                                :loading="isLoading"
                                :disabled="!userInput.trim()"
                                variant="primary"
                                @click="sendMessage"
                            >
                                发送
                            </BaseButton>
                        </div>
                        <div class="input-hint">
                            <span>按 Ctrl + Enter 发送</span>
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </main>

        <BackToTop :visibility-height="100" />
    </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue'
import { useHead } from '@unhead/vue'
import {
    BaseButton,
    GlassPanel,
} from '@/components'

interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

const messages = ref<Message[]>([])
const userInput = ref('')
const isLoading = ref(false)

async function scrollToBottom() {
    await nextTick()
    const messagesList = document.querySelector('.messages-list')
    if (messagesList) {
        messagesList.scrollTop = messagesList.scrollHeight
    }
}

function formatTime(date: Date) {
    return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
    })
}

async function sendMessage() {
    if (!userInput.value.trim() || isLoading.value) {
        return
    }

    const userMessage: Message = {
        role: 'user',
        content: userInput.value.trim(),
        timestamp: new Date(),
    }

    messages.value.push(userMessage)
    const messageToSend = userInput.value
    userInput.value = ''
    isLoading.value = true

    await scrollToBottom()

    try {
        // 这里应该调用实际的AI API
        // 目前使用模拟响应
        await new Promise(resolve => setTimeout(resolve, 1000))

        const assistantMessage: Message = {
            role: 'assistant',
            content: `这是一个模拟的AI回复。在实际应用中，这里会调用真实的AI API来生成回复。\n\n您发送的消息是：${messageToSend}`,
            timestamp: new Date(),
        }

        messages.value.push(assistantMessage)
    }
    catch (error) {
        console.error('Error sending message:', error)
    }
    finally {
        isLoading.value = false
        await scrollToBottom()
    }
}

onMounted(() => {
    // 添加欢迎消息
    messages.value.push({
        role: 'assistant',
        content: '你好！我是AI助手，有什么可以帮助你的吗？',
        timestamp: new Date(),
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
    padding-top: 60px;
    height: calc(100vh - 60px);
}

.chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
    height: 100%;
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  padding-bottom: 120px;
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

[data-theme="dark"] .message-item.user .message-header {
    border-bottom-color: rgba(255, 255, 255, 0.1);
}

.message-role {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-primary);
}

.message-item.user .message-role {
    color: #000000;
}

[data-theme="dark"] .message-item.user .message-role {
    color: #ffffff;
}

.message-time {
    font-size: 11px;
    color: var(--color-text-hint);
}

.message-item.user .message-time {
    color: rgba(0, 0, 0, 0.5);
}

[data-theme="dark"] .message-item.user .message-time {
    color: rgba(255, 255, 255, 0.5);
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

[data-theme="dark"] .message-item.user .message-content {
    color: #ffffff;
}

.input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 24px 24px;
  background: linear-gradient(to top, var(--color-background) 0%, var(--color-background) 70%, transparent 100%);
  z-index: 100;
}

.input-panel {
    padding: 16px;
    max-width: 900px;
    margin: 0 auto;
}

.input-wrapper {
    display: flex;
    gap: 12px;
    align-items: center;
}

.message-input {
    flex: 1;
    height: 40px;
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
    display: flex;
    align-items: center;
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
