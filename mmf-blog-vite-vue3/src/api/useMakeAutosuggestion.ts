import { toValue } from 'vue'
import type { Ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useReceiveStreamData } from './useReceiveStreamData'
import { useChatStore } from '@/api/stores'
import api from '@/api/index-client'

const defaultModelOptions: ModelAiptions = {
    stream: false,
    temperature: 0.8,
    top_p: 1,
    top_k: 5, // top-k 采样
    max_tokens: 16384,
    presence_penalty: 0,
    frequency_penalty: 0,
    seed: 1, // 随机种子
    stop: [], // 生成停止标识
    stream_options: { include_usage: false }, // 流式输出配置
}

export function useMakeAutosuggestion(modelOptions: Ref<ModelAiptions>, scrollFn?: () => void) {
    const chatStore = useChatStore()

    const makeRequestData = (model: string, message: Message): CompletionRequest | null => {
        if (!model) {
            return null // 如果未选择模型，直接返回 null
        }

        // 添加用户消息到聊天记录
        chatStore.addMessage(message)

        // 获取当前的 messages 数组
        const messages = chatStore.messages

        // 确保 user 和 assistant 的 role 交替出现
        for (let i = 1; i < messages.length; i++) {
            const current = messages[i]
            const next = messages[i + 1]

            // 如果当前角色是 user，下一个角色必须是 assistant
            if (current.role === 'user' && next && next.role !== 'assistant') {
                messages.splice(i + 1, 0, { role: 'assistant', content: '' })
            }

            // 如果当前角色是 assistant，下一个角色必须是 user
            if (current.role === 'assistant' && next && next.role !== 'user') {
                messages.splice(i + 1, 0, { role: 'user', content: '' })
            }
        }

        // 确保最后一个角色是 user
        if (messages.length > 0 && messages[messages.length - 1].role !== 'user') {
            messages.push({ role: 'user', content: '' })
        }

        // 获取最后一个 role=user 时的 content 作为模型的提问
        const lastUserMessage = messages[messages.length - 1].content

        // 拼接历史信息（除 system 外）
        const historyMessages = messages
            .slice(0, -1)
            .filter(msg => msg.role !== 'system')
            .map(msg => ({
                role: msg.role,
                content: msg.content,
            }))

        // 滚动到底部
        scrollFn && scrollFn()

        // 返回请求数据
        return {
            ...defaultModelOptions,
            ...toValue(modelOptions),
            model,
            messages: [
                ...historyMessages,
                {
                    role: 'user',
                    content: lastUserMessage,
                },
            ],
        }
    }

    const handleProcessMessage = (json: any) => {
        const choices = json.choices
        choices.forEach((choice: streamChoice) => {
            chatStore.messages[chatStore.messages.length - 1].content += choice.delta?.content ?? ''
        })
        scrollFn && scrollFn()
    }

    const beforeSend = () => {
        const message = { role: 'assistant', content: '' }
        chatStore.addMessage(message)
    }

    useReceiveStreamData(handleProcessMessage, beforeSend)

    const makeAutosuggestion = async (model: string, message: Message) => {
        const requestData = makeRequestData(model, message)
        if (!requestData) {
            ElMessage.error('未选择模型')
            return
        }

        try {
            const response = await api.post('app/chat/completions', requestData)

            if (!response) {
                throw new Error('响应对象不存在')
            }

            useReceiveStreamData(handleProcessMessage, beforeSend)

            return response.data // Return the data
        }
        catch (error) {
            console.error('Error during chatCompletion:', error)
            ElMessage.error('生成建议失败')
        }
    }

    return {
        makeAutosuggestion,
    }
}
