import { toValue } from 'vue'
import type { Ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useChatStore } from '@/api/stores'
import api from '@/api/index-client'
import config from '@/api/config-client'

const defaultModelOptions: ModelAiptions = {
    stream: false,
    temperature: 0.8,
    top_p: 1,
    top_k: 5,
    max_tokens: 16384,
    presence_penalty: 0,
    frequency_penalty: 0,
    seed: 1,
    stop: [],
    stream_options: { include_usage: false },
}

export function useMakeAutosuggestion(modelOptions: Ref<ModelAiptions>, scrollFn?: () => void) {
    const chatStore = useChatStore()

    const makeRequestData = (model: string, message: Message): CompletionRequest | null => {
        if (!model) {
            return null
        }

        chatStore.addMessage(message)
        const messages = chatStore.messages

        for (let i = 1; i < messages.length; i++) {
            const current = messages[i]
            const next = messages[i + 1]
            if (current.role === 'user' && next && next.role !== 'assistant') {
                messages.splice(i + 1, 0, { role: 'assistant', content: '' })
            }
            if (current.role === 'assistant' && next && next.role !== 'user') {
                messages.splice(i + 1, 0, { role: 'user', content: '' })
            }
        }

        if (messages.length > 0 && messages[messages.length - 1].role !== 'user') {
            messages.push({ role: 'user', content: '' })
        }

        const lastUserMessage = messages[messages.length - 1].content
        const historyMessages = messages
            .slice(0, -1)
            .filter(msg => msg.role !== 'system')
            .map(msg => ({
                role: msg.role,
                content: msg.content,
            }))

        scrollFn && scrollFn()

        return {
            ...defaultModelOptions,
            ...toValue(modelOptions),
            model,
            messages: [
                ...historyMessages,
                { role: 'user', content: lastUserMessage },
            ],
        }
    }

    // 处理流式响应
    const handleStreamResponse = async (response: Response) => {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder('utf-8')

        // 添加空的 assistant 消息用于累积内容
        chatStore.addMessage({ role: 'assistant', content: '' })

        const read = async () => {
            if (!reader) {
                console.error('Reader is not available.')
                return
            }

            try {
                const result = await reader.read()
                const { done, value } = result

                if (done) {
                    console.log('Stream completed')
                    return
                }

                const chunk = decoder.decode(value, { stream: true })
                const lines = chunk.split('\n')

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6).trim()
                        if (data === '[DONE]') {
                            console.log('Stream done signal received')
                            return
                        }
                        if (data) {
                            try {
                                const json = JSON.parse(data)
                                if (json.choices && json.choices[0]?.delta?.content) {
                                    chatStore.messages[chatStore.messages.length - 1].content += json.choices[0].delta.content
                                    scrollFn && scrollFn()
                                }
                            }
                            catch (e) {
                                // 忽略解析错误（可能是心跳包等）
                            }
                        }
                    }
                }

                await read() // 继续读取
            }
            catch (error) {
                console.error('Error reading stream:', error)
            }
        }

        await read()
    }

    const makeAutosuggestion = async (model: string, message: Message): Promise<string | void> => {
        const requestData = makeRequestData(model, message)
        if (!requestData) {
            ElMessage.error('未选择模型')
            return
        }

        const isStream = toValue(modelOptions).stream === true

        try {
            if (isStream) {
                // 流式模式：使用 fetch API
                const response = await fetch(config.api + 'app/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify(requestData),
                })

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}))
                    throw new Error(errorData.message || `HTTP ${response.status}`)
                }

                await handleStreamResponse(response)
            }
            else {
                // 非流式模式：使用 axios
                const response = await api.post('app/chat/completions', requestData)
                if (response.code !== 200) {
                    throw new Error(response.message || '请求失败')
                }
                return response.data
            }
        }
        catch (error) {
            console.error('Error during chatCompletion:', error)
            ElMessage.error(error instanceof Error ? error.message : '生成建议失败')
        }
    }

    return {
        makeAutosuggestion,
    }
}
