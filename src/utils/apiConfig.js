import { useSettingsStore } from '../stores/settings'

// 获取文本生成API配置
export const getTextGenerationConfig = () => {
    const settingsStore = useSettingsStore()
    return settingsStore.getTextGenerationConfig()
}

// 获取图片生成API配置
export const getImageGenerationConfig = () => {
    const settingsStore = useSettingsStore()
    return settingsStore.getImageGenerationConfig()
}

// 创建文本生成API请求配置
export const createTextGenerationRequest = (messages, options = {}) => {
    const config = getTextGenerationConfig()

    return {
        url: `${config.baseUrl}chat/completions`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        },
        data: {
            model: config.model,
            messages: messages,
            temperature: config.temperature,
            ...options
        },
        timeout: config.timeout
    }
}

// 创建图片生成API请求配置
export const createImageGenerationRequest = (prompt, options = {}) => {
    const config = getImageGenerationConfig()

    return {
        url: `${config.baseUrl}images/generations`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        },
        data: {
            model: config.model,
            prompt: prompt,
            ...options
        }
    }
}

// 验证配置是否完整
export const validateTextGenerationConfig = () => {
    const config = getTextGenerationConfig()
    return !!(config.baseUrl && config.apiKey && config.model)
}

export const validateImageGenerationConfig = () => {
    const config = getImageGenerationConfig()
    return !!(config.baseUrl && config.apiKey && config.model)
}