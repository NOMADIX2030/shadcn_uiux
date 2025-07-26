#!/bin/bash

# Neon 데이터베이스 설정 스크립트
# shadcn-ui 블로그 프로젝트용

echo "🚀 Neon 데이터베이스 설정을 시작합니다..."

# 환경변수 설정
export PGUSER=neondb_owner
export PGPASSWORD=npg_uFfXjdz4tl7e
export DATABASE_URL="postgresql://neondb_owner:npg_uFfXjdz4tl7e@ep-icy-brook-a11qgkzf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# PostgreSQL 클라이언트 경로 설정
export PATH="/usr/local/opt/postgresql@14/bin:$PATH"

echo "📋 데이터베이스 연결 테스트 중..."
psql "$DATABASE_URL" -c "SELECT version();" || {
    echo "❌ 데이터베이스 연결 실패"
    exit 1
}

echo "✅ 데이터베이스 연결 성공!"

echo "📊 스키마 생성 중..."
psql "$DATABASE_URL" -f database/schema.sql

echo "🌱 초기 데이터 삽입 중..."
psql "$DATABASE_URL" -f database/seed.sql

echo "📈 데이터베이스 상태 확인 중..."
psql "$DATABASE_URL" -c "
SELECT 
    'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 
    'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 
    'posts' as table_name, COUNT(*) as count FROM posts
UNION ALL
SELECT 
    'tags' as table_name, COUNT(*) as count FROM tags
UNION ALL
SELECT 
    'comments' as table_name, COUNT(*) as count FROM comments;
"

echo "🎉 데이터베이스 설정이 완료되었습니다!"
echo ""
echo "📋 다음 단계:"
echo "1. Next.js 프로젝트에 데이터베이스 연결 설정"
echo "2. Prisma 또는 다른 ORM 설정"
echo "3. API 라우트에서 데이터베이스 사용"
echo ""
echo "🔗 연결 정보:"
echo "DATABASE_URL=$DATABASE_URL" 
 
 