# 🚂 Railway 部署指南

本指南将帮助你在 Railway 平台上部署"一饭封神"应用。

## 📋 部署前准备

### 1. 获取 AI API 密钥

你需要准备以下 API 密钥：

- **文本生成 API**：用于菜谱生成
  - 推荐：[302.AI](https://share.302.ai/DymMSI) - 官方合作伙伴
  - 其他选择：OpenAI、Claude、DeepSeek 等

- **图片生成 API**：用于菜品效果图
  - 推荐：[智谱AI](https://open.bigmodel.cn/)
  - 其他选择：DALL-E、Midjourney API 等

### 2. 环境变量配置

在 Railway 部署时，你需要设置以下环境变量：

```bash
# 菜谱生成模型配置
VITE_TEXT_GENERATION_BASE_URL=https://api.lingyiwanwu.com/v1/
VITE_TEXT_GENERATION_API_KEY=your_text_api_key_here
VITE_TEXT_GENERATION_MODEL=yi-lightning
VITE_TEXT_GENERATION_TEMPERATURE=0.7
VITE_TEXT_GENERATION_TIMEOUT=300000

# 图片生成模型配置
VITE_IMAGE_GENERATION_BASE_URL=https://open.bigmodel.cn/api/paas/v4/
VITE_IMAGE_GENERATION_API_KEY=your_image_api_key_here
VITE_IMAGE_GENERATION_MODEL=cogview-3-flash
```

## 🚀 一键部署

### 方法一：使用部署按钮

1. 点击 README 中的 Railway 部署按钮
2. 登录 Railway 账户（如果没有账户，请先注册）
3. 授权 GitHub 访问权限
4. 选择 `oscarka/whattoeatoscarversion` 仓库
5. 配置环境变量（见下方详细步骤）
6. 点击 "Deploy" 开始部署

### 方法二：手动部署

1. 访问 [Railway Dashboard](https://railway.app/dashboard)
2. 点击 "New Project"
3. 选择 "Deploy from GitHub repo"
4. 搜索并选择 `oscarka/whattoeatoscarversion`
5. 等待项目导入完成

## ⚙️ 环境变量配置

### 在 Railway Dashboard 中配置：

1. 进入你的项目页面
2. 点击 "Variables" 标签
3. 添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `VITE_TEXT_GENERATION_BASE_URL` | `https://api.lingyiwanwu.com/v1/` | 文本生成API基础地址 |
| `VITE_TEXT_GENERATION_API_KEY` | `your_api_key_here` | 你的API密钥 |
| `VITE_TEXT_GENERATION_MODEL` | `yi-lightning` | 使用的模型名称 |
| `VITE_TEXT_GENERATION_TEMPERATURE` | `0.7` | 温度参数 |
| `VITE_TEXT_GENERATION_TIMEOUT` | `300000` | 超时时间(毫秒) |
| `VITE_IMAGE_GENERATION_BASE_URL` | `https://open.bigmodel.cn/api/paas/v4/` | 图片生成API地址 |
| `VITE_IMAGE_GENERATION_API_KEY` | `your_image_api_key_here` | 图片生成API密钥 |
| `VITE_IMAGE_GENERATION_MODEL` | `cogview-3-flash` | 图片生成模型 |

### 🔑 API 密钥获取指南

#### 302.AI (推荐)
1. 访问 [302.AI](https://share.302.ai/DymMSI)
2. 注册账户并完成验证
3. 在控制台获取 API Key
4. 设置 `VITE_TEXT_GENERATION_BASE_URL` 为 `https://api.lingyiwanwu.com/v1/`
5. 设置 `VITE_TEXT_GENERATION_API_KEY` 为你的密钥

#### 智谱AI (图片生成)
1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册并完成实名认证
3. 创建应用获取 API Key
4. 设置 `VITE_IMAGE_GENERATION_BASE_URL` 为 `https://open.bigmodel.cn/api/paas/v4/`
5. 设置 `VITE_IMAGE_GENERATION_API_KEY` 为你的密钥

## 🎯 部署后配置

### 1. 自定义域名（可选）

Railway 会为你的应用分配一个随机域名，你也可以绑定自定义域名：

1. 在项目设置中找到 "Domains"
2. 添加你的自定义域名
3. 按照提示配置 DNS 记录

### 2. 环境变量优先级

应用支持以下配置优先级（从高到低）：

1. **Railway 环境变量** - 最高优先级
2. **用户界面设置** - 通过应用内的设置页面配置
3. **默认配置** - 应用内置的默认值

### 3. 动态配置

部署完成后，你可以通过应用内的设置页面动态修改 AI 模型配置：

1. 访问你的应用
2. 点击导航栏的 ⚙️ 设置按钮
3. 修改 API 地址、密钥、模型等参数
4. 保存设置立即生效

## 🔧 故障排除

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本是否为 18+
   - 确保所有依赖都正确安装

2. **API 调用失败**
   - 验证 API 密钥是否正确
   - 检查 API 地址格式
   - 确认网络连接正常

3. **环境变量未生效**
   - 确保变量名以 `VITE_` 开头
   - 检查变量值是否正确设置
   - 重新部署应用

### 日志查看

在 Railway Dashboard 中：
1. 进入你的项目
2. 点击 "Deployments" 查看部署日志
3. 点击 "Logs" 查看实时日志

## 💡 优化建议

1. **性能优化**
   - 使用 CDN 加速静态资源
   - 启用 Gzip 压缩
   - 配置缓存策略

2. **安全建议**
   - 定期更新 API 密钥
   - 使用环境变量存储敏感信息
   - 启用 HTTPS

3. **监控**
   - 设置应用健康检查
   - 监控 API 调用频率
   - 配置错误告警

## 📞 技术支持

如果遇到部署问题，可以：

1. 查看 [Railway 官方文档](https://docs.railway.app/)
2. 在 [GitHub Issues](https://github.com/oscarka/whattoeatoscarversion/issues) 提交问题
3. 联系项目维护者

---

🎉 **恭喜！** 你的"一饭封神"应用已成功部署到 Railway！
