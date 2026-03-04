import axios from 'axios'
import { DS_API_KEY, DS_TARGET_API_URL } from '../config'
import type { Res } from '@/types'

export async function chatCompletions(req: { body: any }, res: Res) {
    const isStream = req.body.stream === true

    // 构建请求体
    const requestBody = {
        model: req.body.model,
        messages: req.body.messages.map((message: { content: any }) => ({
            ...message,
            content: `${message.content} 用中文回答`,
        })),
        stream: isStream,
        temperature: req.body.temperature,
        top_p: req.body.top_p,
        top_k: req.body.top_k,
        max_tokens: req.body.max_tokens,
        presence_penalty: req.body.presence_penalty,
        frequency_penalty: req.body.frequency_penalty,
        seed: req.body.seed,
        stream_options: req.body.stream_options,
    }

    console.log('Chat request:', { model: requestBody.model, stream: isStream, messagesCount: requestBody.messages.length })

    try {
        if (isStream) {
            // 先发送请求到上游 API（不使用流式响应，以便捕获错误）
            const response = await axios.post(DS_TARGET_API_URL, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DS_API_KEY}`,
                },
                responseType: 'stream',
                validateStatus: () => true, // 允许任何状态码
            })

            // 检查上游 API 是否返回错误
            if (response.status !== 200) {
                // 读取错误流
                const chunks: Buffer[] = []
                response.data.on('data', (chunk: Buffer) => chunks.push(chunk))
                response.data.on('end', () => {
                    const errorData = Buffer.concat(chunks).toString()
                    console.error('Upstream API error:', response.status, errorData)
                    return res.status(500).json({
                        code: -200,
                        data: '',
                        message: `上游API错误: ${response.status} - ${errorData}`,
                    })
                })
                return
            }

            // 流式响应：设置 SSE headers
            res.setHeader('Content-Type', 'text/event-stream')
            res.setHeader('Cache-Control', 'no-cache')
            res.setHeader('Connection', 'keep-alive')
            res.setHeader('X-Accel-Buffering', 'no') // 禁用 Nginx 缓冲

            // 将上游流直接管道到响应
            response.data.pipe(res)

            // 错误处理
            response.data.on('error', (err: Error) => {
                console.error('Stream error:', err)
                if (!res.writableEnded) {
                    res.end()
                }
            })

            // 响应结束处理
            response.data.on('end', () => {
                if (!res.writableEnded) {
                    res.end()
                }
            })
        }
        else {
            // 非流式响应
            const response = await axios.post(DS_TARGET_API_URL, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DS_API_KEY}`,
                },
            })

            const responseData = response.data
            let finalContent = ''
            if (responseData.choices && responseData.choices[0] && responseData.choices[0].message && responseData.choices[0].message.content) {
                finalContent = responseData.choices[0].message.content
            }

            return res.json({
                code: 200,
                data: finalContent,
                message: '请求成功',
            })
        }
    }
    catch (error) {
        console.error('Chat completions error:', error)
        if (axios.isAxiosError(error)) {
            console.error('Axios error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            })
            const errorMsg = typeof error.response?.data === 'object'
                ? JSON.stringify(error.response?.data)
                : error.response?.data || error.message
            return res.status(500).json({ code: -200, data: '', message: `API 请求失败: ${errorMsg}` })
        }
        else if (error instanceof Error) {
            return res.status(500).json({ code: -500, data: '', message: `服务器错误: ${error.message}` })
        }
        else {
            return res.status(500).json({ code: -500, data: '', message: '未知服务器错误' })
        }
    }
}
