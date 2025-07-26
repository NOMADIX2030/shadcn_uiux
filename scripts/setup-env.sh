#!/bin/bash

# 환경변수 설정 스크립트
# shadcn-ui 블로그 프로젝트용

echo "🔧 환경변수 설정을 시작합니다..."

# .env.local 파일 생성
cat > .env.local << EOF
# Database Configuration (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_uFfXjdz4tl7e@ep-icy-brook-a11qgkzf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
DB_HOST="ep-icy-brook-a11qgkzf-pooler.ap-southeast-1.aws.neon.tech"
DB_PORT="5432"
DB_NAME="neondb"
DB_USER="neondb_owner"
DB_PASSWORD="npg_uFfXjdz4tl7e"

# Application Configuration
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Security
NEXTAUTH_SECRET="shadcn-blog-secret-key-$(openssl rand -hex 32)"
NEXTAUTH_URL="http://localhost:3000"

# API Keys (if needed)
# NEXT_PUBLIC_API_KEY="your-api-key"

# External Services
# NEXT_PUBLIC_ANALYTICS_ID="your-analytics-id"
EOF

echo "✅ .env.local 파일이 생성되었습니다!"

# 파일 권한 설정
chmod 600 .env.local

echo "🔒 파일 권한이 설정되었습니다 (600)"

# 환경변수 검증
echo "📋 환경변수 검증 중..."
if [ -f .env.local ]; then
    echo "✅ .env.local 파일이 존재합니다"
    
    # DATABASE_URL 확인
    if grep -q "DATABASE_URL" .env.local; then
        echo "✅ DATABASE_URL이 설정되었습니다"
    else
        echo "❌ DATABASE_URL이 설정되지 않았습니다"
    fi
    
    # DB_PASSWORD 확인
    if grep -q "DB_PASSWORD" .env.local; then
        echo "✅ DB_PASSWORD가 설정되었습니다"
    else
        echo "❌ DB_PASSWORD가 설정되지 않았습니다"
    fi
else
    echo "❌ .env.local 파일이 생성되지 않았습니다"
    exit 1
fi

echo ""
echo "🎉 환경변수 설정이 완료되었습니다!"
echo ""
echo "📋 다음 단계:"
echo "1. npm install (필요한 패키지 설치)"
echo "2. npm run dev (개발 서버 시작)"
echo "3. 데이터베이스 연결 테스트"
echo ""
echo "⚠️  주의사항:"
echo "- .env.local 파일은 .gitignore에 포함되어 있습니다"
echo "- 프로덕션에서는 다른 비밀번호를 사용하세요"
echo "- 환경변수는 절대 Git에 커밋하지 마세요" 
 
 