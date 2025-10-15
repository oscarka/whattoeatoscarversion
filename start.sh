#!/bin/bash
# Railway启动脚本

# 设置默认端口
PORT=${PORT:-3000}

# 启动serve服务器
npx serve -s dist -p $PORT
