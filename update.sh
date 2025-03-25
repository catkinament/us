#!/bin/bash

# 获取当前时间作为提交信息
timestamp=$(date "+%Y-%m-%d %H:%M:%S")

# 检查是否有要提交的更改
if git diff --quiet && git diff --cached --quiet; then
  echo "✅ 没有检测到更改，跳过提交"
  exit 0
fi

echo "🚀 开始更新 GitHub 仓库..."

# 添加所有变更文件
git add .

# 提交，并自动添加时间戳
git commit -m "更新于 $timestamp"

# 推送到 GitHub 远程仓库
git push origin main  # 确保你的主分支是 main，如果是 master，请改成 master

echo "✅ 更新完成！"
