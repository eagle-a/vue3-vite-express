import axios from 'axios'
import { DS_API_KEY, DS_TARGET_API_URL } from '../config'
import type { Res, ResData } from '@/types'

export async function chatCompletions(req: { body: any }, res: Res) {
    let jsonResponse: ResData<string> = { code: -500, data: '', message: 'Internal Server Error' } // 默认返回值

    try {
        // 构建请求体，确保与官方示例一致

        const requestBody = {
            model: req.body.model,
            messages: req.body.messages.map((message: { content: any }) => ({
                ...message,
                content: `${message.content} 用中文回答`,
            })),
            stream: false,
            temperature: req.body.temperature,
            top_p: req.body.top_p,
            top_k: req.body.top_k,
            max_tokens: req.body.max_tokens,
            presence_penalty: req.body.presence_penalty,
            frequency_penalty: req.body.frequency_penalty,
            seed: req.body.seed,
            stream_options: req.body.stream_options,
        }
        // 发送流式请求，设置 responseType 为 'stream'
        const response = await axios.post(DS_TARGET_API_URL, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DS_API_KEY}`,
            },
        })

        // 直接处理完整的 JSON 响应
        const responseData = response.data

        // 提取文字内容
        let finalContent = ''
        if (responseData.choices && responseData.choices[0] && responseData.choices[0].message && responseData.choices[0].message.content) {
            finalContent = responseData.choices[0].message.content
        }
        // finalContent = response.data.choices
        jsonResponse = {
            code: 200,
            data: finalContent,
            message: '请求成功',
        }
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('API 请求失败:', error.response?.data)
            jsonResponse = { code: -200, data: '', message: `API 请求失败: ${error.response?.data}` }
        }
        else if (error instanceof Error) {
            console.error('未知错误:', error)
            jsonResponse = { code: -500, data: '', message: `未知错误: ${error.message}` }
        }
        else {
            console.error('未知错误:', error)
            jsonResponse = { code: -500, data: '', message: '未知错误' }
        }
    }

    return res.json(jsonResponse)
}
