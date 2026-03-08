export function useReceiveStreamData(handleProcessMessage: Function,
    beforeSend?: Function) {
    async function handleStreamResponse(response: Response) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder('utf-8')
        // 初始消息
        beforeSend && beforeSend()
        async function read() {
            if (!reader) {
                console.error('Reader is not available.')
                return
            }
            const result: ReadableStreamReadResult<Uint8Array> = await reader.read()
            const { done, value } = result
            if (done) {
                console.log('Connection closed')
                return
            }
            const messageData = decoder.decode(value, { stream: true })
            const messages = messageData.split('\n')
            for (const msg of messages) {
                if (!processMessage(msg)) {
                    return // 如果返回 false，则结束处理
                }
            }
            await read() // 继续读取后续的数据
        }
        if (reader) {
            await read()
        }
    }

    function processMessage(msg: string) {
        const jsonString = msg.replace(/^data: /, '').trim()
        if (jsonString === '[DONE]') {
            console.log('Stream completed')
            return false // 表示结束处理
        }
        if (jsonString) {
            try {
                const json = JSON.parse(jsonString)
                handleProcessMessage(json)
            }
            catch (error) {
                console.error('Failed to parse message:', error)
            }
        }
        return true // 表示继续处理
    }

    return { handleStreamResponse }
}
