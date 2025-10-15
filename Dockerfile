# Railway 部署配置

# 构建配置
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装所有依赖（包括devDependencies用于构建）
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build:railway

# 安装 serve 用于静态文件服务
RUN npm install -g serve

# 清理不需要的文件
RUN rm -rf node_modules src public

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["serve", "-s", "dist", "-l", "3000"]
