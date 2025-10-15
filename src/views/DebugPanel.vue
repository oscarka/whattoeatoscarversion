<template>
    <div class="min-h-screen bg-gray-50 p-4">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-2xl font-bold text-gray-800 mb-6">🔍 Railway 调试面板</h1>
            
            <!-- 环境变量检查 -->
            <div class="bg-white rounded-lg p-6 mb-6 shadow-sm">
                <h2 class="text-lg font-semibold mb-4">📋 环境变量检查</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="(value, key) in envVars" :key="key" class="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span class="font-medium text-sm">{{ key }}</span>
                        <span class="text-sm" :class="value === '未设置' ? 'text-red-600' : 'text-green-600'">
                            {{ value }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- 配置测试 -->
            <div class="bg-white rounded-lg p-6 mb-6 shadow-sm">
                <h2 class="text-lg font-semibold mb-4">⚙️ 配置测试</h2>
                <div class="space-y-4">
                    <div class="flex gap-2">
                        <button @click="testTextAPI" :disabled="isTesting" 
                                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
                            {{ isTesting ? '测试中...' : '测试文本生成API' }}
                        </button>
                        <button @click="testImageAPI" :disabled="isTesting" 
                                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50">
                            {{ isTesting ? '测试中...' : '测试图片生成API' }}
                        </button>
                        <button @click="clearLogs" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                            清空日志
                        </button>
                    </div>
                    
                    <div v-if="testResult" class="p-3 rounded" :class="testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">
                        <div class="font-medium">{{ testResult.success ? '✅ 测试成功' : '❌ 测试失败' }}</div>
                        <div class="text-sm mt-1">{{ testResult.message }}</div>
                    </div>
                </div>
            </div>

            <!-- 实时日志 -->
            <div class="bg-white rounded-lg p-6 shadow-sm">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-semibold">📊 实时日志</h2>
                    <div class="flex gap-2">
                        <button @click="refreshLogs" class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                            刷新
                        </button>
                        <button @click="exportLogs" class="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                            导出日志
                        </button>
                    </div>
                </div>
                
                <div class="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                    <div v-for="log in logs" :key="log.timestamp" class="mb-1">
                        <span class="text-gray-400">[{{ formatTime(log.timestamp) }}]</span>
                        <span :class="getLogColor(log.level)" class="ml-2">{{ log.level.toUpperCase() }}</span>
                        <span class="text-blue-400 ml-2">[{{ log.category.toUpperCase() }}]</span>
                        <span class="ml-2">{{ log.message }}</span>
                        <div v-if="log.data" class="ml-8 text-yellow-400 text-xs">
                            {{ JSON.stringify(log.data, null, 2) }}
                        </div>
                    </div>
                    <div v-if="logs.length === 0" class="text-gray-500">
                        暂无日志...
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { debugLogger, debugEnvironment, debugConfigValidation } from '@/utils/debugHelper'
import { useSettingsStore } from '@/stores/settings'
import { generateRecipe } from '@/services/aiService'
import { generateRecipeImage } from '@/services/imageService'

const settingsStore = useSettingsStore()
const envVars = ref({})
const logs = ref([])
const isTesting = ref(false)
const testResult = ref(null)
let logInterval = null

// 格式化时间
const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString()
}

// 获取日志颜色
const getLogColor = (level) => {
    switch (level) {
        case 'error': return 'text-red-400'
        case 'warn': return 'text-yellow-400'
        case 'info': return 'text-green-400'
        default: return 'text-white'
    }
}

// 刷新日志
const refreshLogs = () => {
    logs.value = debugLogger.getLogs()
}

// 清空日志
const clearLogs = () => {
    debugLogger.clear()
    logs.value = []
}

// 导出日志
const exportLogs = () => {
    const logData = debugLogger.exportLogs()
    const blob = new Blob([logData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `debug-logs-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
}

// 测试文本生成API
const testTextAPI = async () => {
    isTesting.value = true
    testResult.value = null
    
    try {
        debugLogger.info('test', '开始测试文本生成API')
        
        // 使用简单的测试数据
        const testIngredients = ['鸡蛋', '西红柿']
        const testCuisine = {
            id: 'test',
            name: '测试菜系',
            prompt: '请生成一道简单的测试菜谱'
        }
        
        const recipe = await generateRecipe(testIngredients, testCuisine)
        
        testResult.value = {
            success: true,
            message: `API测试成功！生成菜谱：${recipe.name}`
        }
        
        debugLogger.info('test', '文本生成API测试成功', { recipeName: recipe.name })
    } catch (error) {
        testResult.value = {
            success: false,
            message: `API测试失败：${error.message}`
        }
        debugLogger.error('test', '文本生成API测试失败', { error: error.message })
    } finally {
        isTesting.value = false
    }
}

// 测试图片生成API
const testImageAPI = async () => {
    isTesting.value = true
    testResult.value = null
    
    try {
        debugLogger.info('test', '开始测试图片生成API')
        
        // 使用简单的测试菜谱
        const testRecipe = {
            id: 'test-image',
            name: '测试菜品',
            cuisine: '测试菜系',
            ingredients: ['测试食材1', '测试食材2']
        }
        
        const image = await generateRecipeImage(testRecipe)
        
        testResult.value = {
            success: true,
            message: `图片生成API测试成功！生成图片ID：${image.id}`
        }
        
        debugLogger.info('test', '图片生成API测试成功', { imageId: image.id })
    } catch (error) {
        testResult.value = {
            success: false,
            message: `图片生成API测试失败：${error.message}`
        }
        debugLogger.error('test', '图片生成API测试失败', { error: error.message })
    } finally {
        isTesting.value = false
    }
}

onMounted(() => {
    // 初始化环境变量检查
    envVars.value = debugEnvironment()
    
    // 初始化日志
    refreshLogs()
    
    // 设置定时刷新日志
    logInterval = setInterval(refreshLogs, 1000)
    
    debugLogger.info('debug', '调试面板已加载')
})

onUnmounted(() => {
    if (logInterval) {
        clearInterval(logInterval)
    }
})
</script>
