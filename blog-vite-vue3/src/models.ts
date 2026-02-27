// eslint-disable-next-line unused-imports/no-unused-vars
interface Model {
    id: string // 模型的标识符
    object: string // 模型的类型，固定为 "model"
    owned_by: string // 模型的所有者
}

// eslint-disable-next-line unused-imports/no-unused-vars
interface Message {
    role: string // 消息的角色，可以是 "system"、"user" 或 "assistant"
    content: string // 消息的内容
}
// eslint-disable-next-line unused-imports/no-unused-vars
interface response_format {
    type: 'text' | 'json_object'
}
// eslint-disable-next-line unused-imports/no-unused-vars
interface tool {
    type: string
    function: {
        name: string
        description?: string
        parameters?: any
    }
}
// eslint-disable-next-line unused-imports/no-unused-vars
interface ChatCompletionNamedToolChoice {
    tool: string
    function: {
        name: string
    }
}

interface ModelAiptions {
    temperature?: number // 生成文本的温度，值越高，生成的文本越随机。取值范围 (0, 2)，默认值为 0.8
    top_p?: number // 生成文本的 top_p 值，值越高，生成的文本越随机。取值范围 (0, 1]，默认值为 0.8
    top_k?: number // 生成文本的 top_k 值，取值越大，生成的随机性越高。取值范围 [1, 100]，默认值为 5
    max_tokens?: number // 生成文本的最大长度。取值范围 (0, 16384]，默认值为 16384
    frequency_penalty?: number // 频率惩罚，取值范围 [-2.0, 2.0]，默认值为 0.0
    presence_penalty?: number // 存在惩罚，取值范围 [-2.0, 2.0]，默认值为 0.0
    seed?: number // 随机种子，取值范围 (0, 9223372036854775807]
    stop?: string | string[] // 停止生成文本的标记列表。一个 string 或最多包含 16 个 string 的 list，在遇到这些词时，API 将停止生成更多的 token
    stream?: boolean // 是否流式传输响应。默认值为 false
    stream_options?: {
        include_usage?: boolean // 是否在流式传输响应中包含使用情况。默认值为 false
    }
    logprobs?: boolean // 是否返回每个 token 的对数概率
    top_logprobs?: number // 返回 top_logprobs 个最可能的 token 的对数概率
}
// 继承自 ModelAiptions 的接口
// eslint-disable-next-line unused-imports/no-unused-vars
interface CompletionRequest extends ModelAiptions {
    model: string // 模型的标识符
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
}

interface tool_call {
    id: string
    type: string
    function: {
        name: string
        arguments: string
    }
}
interface logprobs_content {
    token: string
    logprob: number
    bytes: number
    top_logprobs: {
        token: string
        logprob: number
        bytes: number
    }[]
}

// eslint-disable-next-line unused-imports/no-unused-vars
interface CompletionResponse {
    id: string
    object: string
    created: number
    model: string
    system_fingerprint: string
    choices: {
        index: number
        message: {
            role: string
            content: string
            tool_calls?: tool_call[]
        }
        logprobs?: {
            content: logprobs_content[]
        }
        finish_reason: string
    }[]
    usage?: {
        prompt_tokens: number
        completion_tokens: number
        total_tokens: number
        prompt_cache_hit_tokens: number
        prompt_cache_miss_tokens: number
    }
}

// eslint-disable-next-line unused-imports/no-unused-vars
interface streamChoice {
    index: number
    delta: {
        role: string
        content: string
    }
    finish_reason: string
    logprobs?: {
        content: logprobs_content[]
    }
}
