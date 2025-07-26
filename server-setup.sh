#!/bin/bash

# shadcn-ui 블로그 서버 설정 스크립트
# Ubuntu 24.04 LTS용

echo "🚀 shadcn-ui 블로그 서버 설정을 시작합니다..."

# 시스템 업데이트
echo "📦 시스템 패키지 업데이트 중..."
sudo apt update && sudo apt upgrade -y

# Node.js 18.x LTS 설치
echo "📦 Node.js 18.x LTS 설치 중..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Node.js 버전 확인
echo "✅ Node.js 설치 완료:"
node --version
npm --version

# PM2 설치 (프로세스 관리)
echo "📦 PM2 설치 중..."
sudo npm install -g pm2

# Git 설치
echo "📦 Git 설치 중..."
sudo apt install -y git

# Nginx 설치
echo "📦 Nginx 설치 중..."
sudo apt install -y nginx

# 방화벽 설정
echo "🔒 방화벽 설정 중..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# 작업 디렉토리 생성
echo "📁 작업 디렉토리 생성 중..."
mkdir -p /home/ubuntu/projects
cd /home/ubuntu/projects

echo "✅ 기본 서버 설정이 완료되었습니다!"
echo "📋 다음 단계:"
echo "1. 프로젝트 클론 또는 업로드"
echo "2. 의존성 설치: npm install"
echo "3. 빌드: npm run build"
echo "4. PM2로 실행: pm2 start npm --name 'shadcn-blog' -- start" 
 
 