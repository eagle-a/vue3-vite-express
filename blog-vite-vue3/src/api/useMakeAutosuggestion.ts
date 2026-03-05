import { toValue, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { ElMessage } from 'element-plus'
import DOMPurify from 'dompurify'
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

    let abortController: AbortController | null = null

    onUnmounted(() => {
        if (abortController) {
            abortController.abort()
            abortController = null
        }
    })

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
            .filter((msg): msg is Message => msg.role !== 'system')
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
                { role: 'user' as const, content: lastUserMessage },
            ],
        }
    }

    const handleStreamResponse = async (response: Response) => {
        const reader = response.body?.getReader()
        if (!reader) {
            console.error('Reader is not available.')
            return
        }

        const decoder = new TextDecoder('utf-8')

        chatStore.addMessage({ role: 'assistant', content: '' })

        let buffer = ''

        try {
            while (true) {
                const { done, value } = await reader.read()

                if (done) {
                    console.log('Stream completed')
                    if (buffer.trim()) {
                        processSSELine(buffer.trim())
                    }
                    return
                }

                buffer += decoder.decode(value, { stream: true })

                const events = buffer.split('\n\n')
                buffer = events.pop() || ''

                for (const event of events) {
                    if (!event.trim()) continue

                    const lines = event.split('\n')
                    for (const line of lines) {
                        await processSSELine(line.trim())
                    }
                }
            }
        }
        catch (error) {
            console.error('Error reading stream:', error)
            throw error
        }
    }

    const processSSELine = async (line: string) => {
        if (!line) return

        if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()

            if (data === '[DONE]') {
                console.log('Stream done signal received')
                return
            }

            if (data) {
                try {
                    const json = JSON.parse(data)

                    if (json.error) {
                        throw new Error(json.error)
                    }

                    if (json.choices && json.choices[0]?.delta) {
                        const delta = json.choices[0].delta

                        if ('content' in delta && delta.content !== null && delta.content !== undefined) {
                            chatStore.messages[chatStore.messages.length - 1].content += delta.content
                            scrollFn && scrollFn()
                        }

                        if ('reasoning_content' in delta && delta.reasoning_content !== null && delta.reasoning_content !== undefined) {
                            const sanitizedContent = DOMPurify.sanitize(delta.reasoning_content)
                            const thinkContent = `<small style="font-size: 0.8em; color: blue;">${sanitizedContent}</small>`
                            chatStore.messages[chatStore.messages.length - 1].content += thinkContent
                            scrollFn && scrollFn()
                        }
                    }
                }
                catch (e) {
                    if (e instanceof SyntaxError) {
                        console.warn('Failed to parse SSE data:', data.substring(0, 100))
                    }
                    else {
                        throw e
                    }
                }
            }
        }
    }

    const makeAutosuggestion = async (model: string, message: Message): Promise<string | void> => {
        const requestData = makeRequestData(model, message)
        if (!requestData) {
            ElMessage.error('未选择模型')
            return
        }

        const isStream = toValue(modelOptions).stream === true

        if (abortController) {
            abortController.abort()
        }
        abortController = new AbortController()

        try {
            if (isStream) {
                console.log('Sending stream request to:', config.api + 'app/chat/completions')

                const response = await fetch(config.api + 'app/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'text/event-stream',
                    },
                    body: JSON.stringify(requestData),
                    signal: abortController.signal,
                })

                console.log('Response status:', response.status, response.statusText)

                if (!response.ok) {
                    const errorText = await response.text()
                    let errorMsg = `HTTP ${response.status}`
                    try {
                        const errorData = JSON.parse(errorText)
                        errorMsg = errorData.message || errorMsg
                    }
                    catch {
                        errorMsg = errorText || errorMsg
                    }
                    throw new Error(errorMsg)
                }

                await handleStreamResponse(response)
            }
            else {
                const response = await api.post('app/chat/completions', requestData)
                if (response.code !== 200) {
                    throw new Error(response.message || '请求失败')
                }
                return response.data
            }
        }
        catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('Request aborted')
                return
            }
            console.error('Error during chatCompletion:', error)
            ElMessage.error(error instanceof Error ? error.message : '生成建议失败')
            throw error
        }
        finally {
            abortController = null
        }
    }

    return {
        makeAutosuggestion,
    }
}