# 配置系统使用说明

## 概述

新增的配置系统允许用户在运行时动态修改 AI 模型配置，包括菜谱生成模型和图片生成模型的设置。

## 功能特性

### 1. 配置管理

-   **默认配置**: 系统启动时自动从环境变量(.env)加载默认配置
-   **持久化存储**: 用户修改的配置自动保存到 localStorage
-   **实时生效**: 配置修改后立即生效，无需重启应用

### 2. 支持的配置项

#### 菜谱生成模型配置

-   API 地址 (baseUrl)
-   API 密钥 (apiKey)
-   模型名称 (model)
-   温度参数 (temperature): 0-1 之间的数值
-   超时时间 (timeout): 毫秒为单位

#### 图片生成模型配置

-   API 地址 (baseUrl)
-   API 密钥 (apiKey)
-   模型名称 (model)

## 使用方法

### 1. 打开设置界面

-   点击导航栏右侧的设置按钮（齿轮图标）
-   设置弹窗会显示当前配置

### 2. 修改配置

-   在弹窗中修改相应的配置项
-   点击"保存设置"按钮应用更改
-   点击"恢复默认"可重置为环境变量中的配置

### 3. 配置验证

-   系统会自动验证配置的完整性
-   不完整的配置会在 API 调用时给出友好提示

## 开发者集成

### 1. 在组件中使用配置

```javascript
import { useSettingsStore } from '@/stores/settings'
import { getTextGenerationConfig, createTextGenerationRequest } from '@/utils/apiConfig'

// 获取配置
const settingsStore = useSettingsStore()
const textConfig = settingsStore.getTextGenerationConfig()

// 创建API请求
const requestConfig = createTextGenerationRequest([{ role: 'user', content: '你的提示词' }])
```

### 2. 更新现有 API 调用

原来的代码：

```javascript
const response = await axios.post('/chat/completions', {
    model: 'yi-lightning'
    // ...
})
```

更新后的代码：

```javascript
import { createAiClient } from '@/utils/apiConfig'

const aiClient = createAiClient()
const config = getTextGenerationConfig()

const response = await aiClient.post('/chat/completions', {
    model: config.model
    // ...
})
```

### 3. 配置验证

```javascript
import { validateTextGenerationConfig } from '@/utils/apiConfig'

if (!validateTextGenerationConfig()) {
    throw new Error('配置不完整，请检查设置')
}
```

## 文件结构

```
src/
├── components/
│   ├── SettingsModal.vue      # 设置弹窗组件
│   ├── SettingsButton.vue     # 设置按钮组件
│   └── ConfigTest.vue         # 配置测试组件
├── stores/
│   └── settings.js            # 配置状态管理
├── utils/
│   └── apiConfig.js           # API配置工具函数
└── services/
    └── aiService.ts           # 已更新使用动态配置
```

## 配置存储

-   **环境变量**: `.env` 文件中的默认配置
-   **用户配置**: localStorage 中的 `yifan-fengshen-settings` 键
-   **优先级**: 用户配置 > 环境变量默认值

## 注意事项

1. **API 密钥安全**: 密钥在界面中以密码形式显示，但仍存储在 localStorage 中
2. **配置同步**: 多个标签页会自动同步配置更改
3. **错误处理**: API 调用失败时会显示友好的错误信息
4. **向后兼容**: 现有功能完全兼容，无需修改使用方式

## 测试配置

可以使用 `ConfigTest.vue` 组件测试配置是否正确：

```vue
<template>
    <ConfigTest />
</template>

<script setup>
import ConfigTest from '@/components/ConfigTest.vue'
</script>
```

## 故障排除

### 常见问题

1. **API 调用失败**

    - 检查 API 地址是否正确
    - 验证 API 密钥是否有效
    - 确认网络连接正常

2. **配置不生效**

    - 刷新页面重新加载配置
    - 检查浏览器控制台是否有错误信息
    - 清除 localStorage 重置配置

3. **界面显示异常**
    - 确认所有组件文件已正确创建
    - 检查导入路径是否正确
    - 验证 Vue 组件语法
