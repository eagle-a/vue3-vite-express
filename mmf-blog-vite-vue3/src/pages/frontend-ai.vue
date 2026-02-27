<template>
    <div class="h-full flex flex-col relative overflow-hidden">
        <!-- 顶部栏 -->
        <div class="flex-1 overflow-y-auto relative">
            <el-row class="top-0 bg-white w-full h-12 z-10 sticky flex justify-between items-center px-4">
                <el-dropdown :max-height="200" @command="handleCommand">
                    <span class="el-dropdown-link text-lg font-semibold text-[#213547] flex items-center">
                        {{ model }}
                        <el-icon class="ml-1">
                            <ArrowDown />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-for="item in modelList" :key="item.id" :command="item.id">
                                {{ item.id }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-radio-group v-model="modelOptions.stream" size="small">
                    <el-radio-button label="非流式返回" :value="true" />
                    <el-radio-button label="流式返回" :value="false" />
                </el-radio-group>
            </el-row>

            <!-- 消息列表 -->
            <div id="scrollId" class="w-[60%] mx-auto pb-[200px]">
                <div v-for="(item, index) in messages" :key="index" :class="{ 'mt-5': index !== 0 }">
                    <div class="flex items-center" :class="{ 'flex-row-reverse': item.role === 'user' }">
                        <el-icon>
                            <UserFilled v-if="item.role === 'assistant'" />
                            <Avatar v-else />
                        </el-icon>
                        <span class="font-bold" :class="item.role === 'user' ? 'mr-2' : 'ml-2'">
                            {{ item.role === 'user' ? 'You' : model }}
                        </span>
                    </div>
                    <p class="pl-6" :class="{ 'flex justify-end mt-2': item.role === 'user' }">
                        <span v-if="item.role === 'user'" class="whitespace-pre-wrap max-w-full break-words bg-gray-100 p-2 rounded">
                            {{ item.content }}
                        </span>
                        <MdPreview v-else editor-id="preview-only" :model-value="item.content" />
                    </p>
                </div>
            </div>
        </div>

        <!-- 输入框 -->
        <div class="fixed bottom-0 left-0 right-0 bg-white shadow-md">
            <div class="w-[60%] mx-auto py-4">
                <div class="relative">
                    <el-input
                        v-model="inputVal"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 5 }"
                        resize="none"
                        class="w-full"
                        @keydown="handleKeydown"
                    />
                    <el-button
                        type="primary"
                        :icon="Position"
                        :disabled="isBtnDisabled"
                        class="absolute right-6 bottom-2"
                        @click="sendMessage"
                    />
                </div>
                <!-- 底部提示 -->
                <div class="text-xs text-gray-500 text-center mt-2">
                    这玩意 也可能会犯错。请核查重要信息。
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ArrowDown, Avatar, Position, UserFilled } from '@element-plus/icons-vue'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { useMakeAutosuggestion } from '@/api/useMakeAutosuggestion'
import { useChatStore } from '@/api/stores/chat'

// 模型相关
const model = ref<string>('deepseek')
const modelId = ref<string>('4bd107bff85941239e27b1509eccfe98')
const modelList = ref<Model[]>([])

// 消息相关
const { messages } = storeToRefs(useChatStore())
const { clearMessages } = useChatStore()

// 输入框相关
const inputVal = ref<string>('')
const isBtnDisabled = computed(() => inputVal.value.trim() === '')

// 模型选项
const modelOptions = ref<ModelAiptions>({
    stream: true,
})

// 处理下拉菜单选择
function handleCommand(command: string | number | object) {
    clearMessages()
}

function processAndConcatContent(content: string) {
    const thinkMatch = content.match(/<think>(.*?)<\/think>/s)
    if (thinkMatch) {
        const thinkContent = thinkMatch[1]
        const smallThinkContent = `<small style="font-size: 0.8em; color: blue;">${thinkContent}</small>`
        return content.replace(thinkMatch[0], smallThinkContent)
    }
    return content
}

// 发送消息
const { makeAutosuggestion } = useMakeAutosuggestion(modelOptions, scrollToBottom)
async function sendMessage() {
    if (isBtnDisabled.value)
        return

    const message = {
        role: 'user',
        content: inputVal.value,
    }
    inputVal.value = ''

    try {
        const messgae_ai = await makeAutosuggestion(modelId.value, message)
        // 处理 content 中的 <think>...</think> 内容
        const processedContent = processAndConcatContent(messgae_ai)
        messages.value.push({
            role: 'assistant',
            content: processedContent,
        })
    }
    catch (error) {
        console.error('发送消息失败:', error)
    }
}

// 处理键盘事件
function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        sendMessage()
    }
}

// 滚动到底部
function scrollToBottom() {
    setTimeout(() => {
        const scrollId = document.getElementById('scrollId')
        scrollId?.scrollIntoView({ block: 'end' })
    }, 0)
}
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.el-textarea :deep(.el-textarea__inner) {
  padding-right: 90px;
}
</style>
