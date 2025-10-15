// Railway调试工具 - 增强版日志记录
// 添加到 src/utils/debugHelper.ts

export interface DebugInfo {
    timestamp: string
    level: 'info' | 'warn' | 'error'
    category: 'api' | 'config' | 'ui' | 'network'
    message: string
    data?: any
}

class DebugLogger {
    private logs: DebugInfo[] = []
    private maxLogs = 100

    log(level: DebugInfo['level'], category: DebugInfo['category'], message: string, data?: any) {
        const logEntry: DebugInfo = {
            timestamp: new Date().toISOString(),
            level,
            category,
            message,
            data
        }
        
        this.logs.push(logEntry)
        
        // 保持日志数量在限制内
        if (this.logs.length > this.maxLogs) {
            this.logs.shift()
        }
        
        // 同时输出到控制台
        const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'
        console[consoleMethod](`[${category.toUpperCase()}] ${message}`, data || '')
    }

    info(category: DebugInfo['category'], message: string, data?: any) {
        this.log('info', category, message, data)
    }

    warn(category: DebugInfo['category'], message: string, data?: any) {
        this.log('warn', category, message, data)
    }

    error(category: DebugInfo['category'], message: string, data?: any) {
        this.log('error', category, message, data)
    }

    getLogs(): DebugInfo[] {
        return [...this.logs]
    }

    getLogsByCategory(category: DebugInfo['category']): DebugInfo[] {
        return this.logs.filter(log => log.category === category)
    }

    clear() {
        this.logs = []
    }

    // 导出日志为JSON字符串
    exportLogs(): string {
        return JSON.stringify(this.logs, null, 2)
    }
}

export const debugLogger = new DebugLogger()

// API调用增强调试
export const debugApiCall = async (apiName: string, config: any, requestData: any) => {
    debugLogger.info('api', `开始调用 ${apiName} API`, {
        url: config.url,
        model: config.model || requestData.model,
        hasApiKey: !!config.apiKey,
        apiKeyLength: config.apiKey?.length || 0
    })

    try {
        const startTime = Date.now()
        const response = await fetch(config.url, {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify(requestData)
        })
        
        const endTime = Date.now()
        const duration = endTime - startTime

        debugLogger.info('api', `${apiName} API 响应时间: ${duration}ms`, {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
        })

        if (!response.ok) {
            const errorText = await response.text()
            debugLogger.error('api', `${apiName} API 请求失败`, {
                status: response.status,
                statusText: response.statusText,
                errorBody: errorText
            })
            throw new Error(`API请求失败: ${response.status} - ${errorText}`)
        }

        const responseData = await response.json()
        debugLogger.info('api', `${apiName} API 调用成功`, {
            responseKeys: Object.keys(responseData),
            hasData: !!responseData.data,
            dataLength: responseData.data?.length || 0
        })

        return responseData
    } catch (error) {
        debugLogger.error('api', `${apiName} API 调用异常`, {
            error: error.message,
            stack: error.stack
        })
        throw error
    }
}

// 环境变量调试
export const debugEnvironment = () => {
    const envVars = {
        VITE_TEXT_GENERATION_BASE_URL: import.meta.env.VITE_TEXT_GENERATION_BASE_URL,
        VITE_TEXT_GENERATION_API_KEY: import.meta.env.VITE_TEXT_GENERATION_API_KEY ? '***已设置***' : '未设置',
        VITE_TEXT_GENERATION_MODEL: import.meta.env.VITE_TEXT_GENERATION_MODEL,
        VITE_IMAGE_GENERATION_BASE_URL: import.meta.env.VITE_IMAGE_GENERATION_BASE_URL,
        VITE_IMAGE_GENERATION_API_KEY: import.meta.env.VITE_IMAGE_GENERATION_API_KEY ? '***已设置***' : '未设置',
        VITE_IMAGE_GENERATION_MODEL: import.meta.env.VITE_IMAGE_GENERATION_MODEL,
        NODE_ENV: import.meta.env.NODE_ENV,
        MODE: import.meta.env.MODE
    }

    debugLogger.info('config', '环境变量检查', envVars)
    return envVars
}

// 配置验证调试
export const debugConfigValidation = (config: any, configType: 'text' | 'image') => {
    const validation = {
        hasBaseUrl: !!config.baseUrl,
        hasApiKey: !!config.apiKey,
        hasModel: !!config.model,
        baseUrlValid: config.baseUrl?.startsWith('http'),
        apiKeyLength: config.apiKey?.length || 0
    }

    debugLogger.info('config', `${configType} 配置验证`, {
        ...validation,
        baseUrl: config.baseUrl,
        model: config.model
    })

    return validation
}
