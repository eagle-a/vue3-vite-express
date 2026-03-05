import { Buffer } from 'node:buffer'
import process from 'node:process'
import axios from 'axios'
import { DS_API_KEY, DS_TARGET_API_URL } from '../config'
import type { Res } from '@/types'

const isProd = process.env.NODE_ENV === 'production'

interface ChatMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
}

interface ChatRequestBody {
    model?: string
    messages: ChatMessage[]
    stream?: boolean
    temperature?: number
    top_p?: number
    top_k?: number
    max_tokens?: number
    presence_penalty?: number
    frequency_penalty?: number
    seed?: number
    stream_options?: { include_usage: boolean }
}

export async function chatCompletions(req: { body: ChatRequestBody }, res: Res) {
    const isStream = req.body.stream === true

    if (!req.body.messages || !Array.isArray(req.body.messages)) {
        return res.status(400).json({
            code: -400,
            data: '',
            message: 'messages 参数无效',
        })
    }

    const requestBody: ChatRequestBody = {
        model: req.body.model || 'deepseek-chat',
        messages: req.body.messages.map((message) => ({
            role: message.role,
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

    if (!DS_API_KEY) {
        console.error('DS_API_KEY is not configured')
        return res.status(500).json({
            code: -500,
            data: '',
            message: 'API Key 未配置，请在 .env 文件中设置 DS_API_KEY',
        })
    }

    try {
        if (isStream) {
            res.setHeader('Content-Type', 'text/event-stream')
            res.setHeader('Cache-Control', 'no-cache, no-transform')
            res.setHeader('Connection', 'keep-alive')
            res.setHeader('X-Accel-Buffering', 'no')
            res.setHeader('Transfer-Encoding', 'chunked')
            res.flushHeaders()

            console.log('Starting stream request to:', DS_TARGET_API_URL)

            const response = await axios.post(DS_TARGET_API_URL, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DS_API_KEY}`,
                    'Accept': 'text/event-stream',
                },
                responseType: 'stream',
                timeout: 60000,
                validateStatus: () => true,
            })

            if (response.status !== 200) {
                const chunks: Buffer[] = []
                response.data.on('data', (chunk: Buffer) => chunks.push(chunk))
                response.data.on('end', () => {
                    const errorData = Buffer.concat(chunks).toString()
                    console.error('Upstream API error:', response.status, errorData)
                    const errorMsg = isProd ? '上游服务错误' : `上游 API 错误：${response.status} - ${errorData.substring(0, 200)}`
                    res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`)
                    res.write('data: [DONE]\n\n')
                    res.end()
                })
                return
            }

            response.data.on('data', (chunk: Buffer) => {
                const data = chunk.toString()
                console.log('Stream chunk:', data.substring(0, 100))
                res.write(chunk)
            })

            response.data.on('error', (err: Error) => {
                console.error('Stream error:', err)
                if (!res.writableEnded) {
                    try {
                        res.write('data: [DONE]\n\n')
                        res.end()
                    }
                    catch {
                        // ignore
                    }
                }
            })

            response.data.on('end', () => {
                console.log('Stream ended')
                if (!res.writableEnded) {
                    try {
                        res.end()
                    }
                    catch {
                        // ignore
                    }
                }
            })
        }
        else {
            const response = await axios.post(DS_TARGET_API_URL, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DS_API_KEY}`,
                },
                timeout: 60000,
            })

            const responseData = response.data
            let finalContent = ''
            if (responseData.choices?.[0]?.message?.content) {
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
                message: error.message,
                code: error.code,
            })
            const errorMsg = isProd ? 'API 请求失败' : `API 请求失败：${error.message}`
            if (isStream && res.headersSent) {
                res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`)
                res.write('data: [DONE]\n\n')
                res.end()
                return
            }
            return res.status(500).json({ code: -200, data: '', message: errorMsg })
        }
        else if (error instanceof Error) {
            const errorMsg = isProd ? '服务器错误' : `服务器错误：${error.message}`
            if (isStream && res.headersSent) {
                res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`)
                res.write('data: [DONE]\n\n')
                res.end()
                return
            }
            return res.status(500).json({ code: -500, data: '', message: errorMsg })
        }
        else {
            return res.status(500).json({ code: -500, data: '', message: '未知服务器错误' })
        }
    }
}