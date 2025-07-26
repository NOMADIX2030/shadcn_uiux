#!/bin/bash

# 환경변수 설정 스크립트
# Next.js 15.4.4 프로젝트 환경변수 관리

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 로그 함수
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# .env.local 파일 경로
ENV_FILE=".env.local"

# JWT 시크릿 키 생성 함수
generate_jwt_secret() {
    # 64자리 랜덤 문자열 생성
    openssl rand -base64 48 | tr -d "=+/" | cut -c1-64
}

# 환경변수 설정 함수
setup_environment() {
    log_info "환경변수 설정을 시작합니다..."
    
    # .env.local 파일이 존재하는지 확인
    if [ -f "$ENV_FILE" ]; then
        log_warning ".env.local 파일이 이미 존재합니다."
        read -p "기존 파일을 덮어쓰시겠습니까? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "설정을 취소했습니다."
            return
        fi
    fi
    
    # 데이터베이스 정보 입력
    log_info "데이터베이스 정보를 입력하세요:"
    
    read -p "DATABASE_URL (기본값: postgresql://neondb_owner:Neon123!@ep-icy-brook-a11qgkzf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require): " DATABASE_URL
    DATABASE_URL=${DATABASE_URL:-"postgresql://neondb_owner:Neon123!@ep-icy-brook-a11qgkzf-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"}
    
    read -p "DB_HOST (기본값: ep-icy-brook-a11qgkzf-pooler.ap-southeast-1.aws.neon.tech): " DB_HOST
    DB_HOST=${DB_HOST:-"ep-icy-brook-a11qgkzf-pooler.ap-southeast-1.aws.neon.tech"}
    
    read -p "DB_PORT (기본값: 5432): " DB_PORT
    DB_PORT=${DB_PORT:-"5432"}
    
    read -p "DB_NAME (기본값: neondb): " DB_NAME
    DB_NAME=${DB_NAME:-"neondb"}
    
    read -p "DB_USER (기본값: neondb_owner): " DB_USER
    DB_USER=${DB_USER:-"neondb_owner"}
    
    read -p "DB_PASSWORD (기본값: Neon123!): " DB_PASSWORD
    DB_PASSWORD=${DB_PASSWORD:-"Neon123!"}
    
    # JWT 설정
    log_info "JWT 설정을 구성합니다..."
    
    read -p "JWT_SECRET을 자동 생성하시겠습니까? (Y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        read -p "JWT_SECRET을 입력하세요: " JWT_SECRET
        if [ -z "$JWT_SECRET" ]; then
            log_error "JWT_SECRET은 필수입니다."
            return 1
        fi
    else
        JWT_SECRET=$(generate_jwt_secret)
        log_success "JWT_SECRET이 자동 생성되었습니다."
    fi
    
    read -p "JWT_EXPIRES_IN (기본값: 7d): " JWT_EXPIRES_IN
    JWT_EXPIRES_IN=${JWT_EXPIRES_IN:-"7d"}
    
    read -p "JWT_REFRESH_EXPIRES_IN (기본값: 30d): " JWT_REFRESH_EXPIRES_IN
    JWT_REFRESH_EXPIRES_IN=${JWT_REFRESH_EXPIRES_IN:-"30d"}
    
    # 애플리케이션 설정
    log_info "애플리케이션 설정을 구성합니다..."
    
    read -p "NEXT_PUBLIC_APP_URL (기본값: http://localhost:3000): " NEXT_PUBLIC_APP_URL
    NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-"http://localhost:3000"}
    
    read -p "NODE_ENV (기본값: development): " NODE_ENV
    NODE_ENV=${NODE_ENV:-"development"}
    
    # 보안 설정
    log_info "보안 설정을 구성합니다..."
    
    NEXTAUTH_SECRET=$(generate_jwt_secret)
    NEXTAUTH_URL="$NEXT_PUBLIC_APP_URL"
    
    # .env.local 파일 생성
    log_info ".env.local 파일을 생성합니다..."
    
    cat > "$ENV_FILE" << EOF
# Database Configuration
DATABASE_URL="$DATABASE_URL"
DB_HOST="$DB_HOST"
DB_PORT="$DB_PORT"
DB_NAME="$DB_NAME"
DB_USER="$DB_USER"
DB_PASSWORD="$DB_PASSWORD"

# JWT Configuration
JWT_SECRET="$JWT_SECRET"
JWT_EXPIRES_IN="$JWT_EXPIRES_IN"
JWT_REFRESH_EXPIRES_IN="$JWT_REFRESH_EXPIRES_IN"

# Application Configuration
NEXT_PUBLIC_APP_URL="$NEXT_PUBLIC_APP_URL"
NODE_ENV="$NODE_ENV"

# Security Configuration
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
NEXTAUTH_URL="$NEXTAUTH_URL"
EOF
    
    log_success ".env.local 파일이 생성되었습니다."
    
    # 파일 권한 설정
    chmod 600 "$ENV_FILE"
    log_success "파일 권한이 설정되었습니다 (600)."
    
    # 환경변수 검증
    log_info "환경변수를 검증합니다..."
    
    if [ -f "$ENV_FILE" ]; then
        log_success "환경변수 파일이 성공적으로 생성되었습니다."
        echo ""
        echo "📋 설정된 환경변수:"
        echo "- DATABASE_URL: ${DATABASE_URL:0:50}..."
        echo "- DB_HOST: $DB_HOST"
        echo "- DB_PORT: $DB_PORT"
        echo "- DB_NAME: $DB_NAME"
        echo "- DB_USER: $DB_USER"
        echo "- JWT_SECRET: ${JWT_SECRET:0:20}..."
        echo "- JWT_EXPIRES_IN: $JWT_EXPIRES_IN"
        echo "- JWT_REFRESH_EXPIRES_IN: $JWT_REFRESH_EXPIRES_IN"
        echo "- NEXT_PUBLIC_APP_URL: $NEXT_PUBLIC_APP_URL"
        echo "- NODE_ENV: $NODE_ENV"
        echo ""
        log_success "🎉 환경변수 설정이 완료되었습니다!"
        echo ""
        echo "🔧 다음 단계:"
        echo "1. npm run dev - 개발 서버 실행"
        echo "2. npm run db:setup - 데이터베이스 설정"
        echo "3. npm run api:test - API 테스트"
        echo "4. npm run auth:test - 인증 테스트"
    else
        log_error "환경변수 파일 생성에 실패했습니다."
        return 1
    fi
}

# 환경변수 검증 함수
validate_environment() {
    log_info "환경변수를 검증합니다..."
    
    if [ ! -f "$ENV_FILE" ]; then
        log_error ".env.local 파일이 존재하지 않습니다."
        return 1
    fi
    
    # 필수 환경변수 확인
    source "$ENV_FILE"
    
    local missing_vars=()
    
    if [ -z "$DATABASE_URL" ]; then
        missing_vars+=("DATABASE_URL")
    fi
    
    if [ -z "$JWT_SECRET" ]; then
        missing_vars+=("JWT_SECRET")
    fi
    
    if [ -z "$NEXT_PUBLIC_APP_URL" ]; then
        missing_vars+=("NEXT_PUBLIC_APP_URL")
    fi
    
    if [ ${#missing_vars[@]} -eq 0 ]; then
        log_success "모든 필수 환경변수가 설정되어 있습니다."
        return 0
    else
        log_error "다음 환경변수가 누락되었습니다: ${missing_vars[*]}"
        return 1
    fi
}

# 메인 실행 함수
main() {
    echo ""
    echo "🔧 Next.js 15.4.4 환경변수 설정 도구"
    echo "=" * 50
    echo ""
    
    case "${1:-setup}" in
        "setup")
            setup_environment
            ;;
        "validate")
            validate_environment
            ;;
        "help"|"-h"|"--help")
            echo "사용법: $0 [setup|validate|help]"
            echo ""
            echo "명령어:"
            echo "  setup    - 환경변수 설정 (기본값)"
            echo "  validate - 환경변수 검증"
            echo "  help     - 도움말 표시"
            ;;
        *)
            log_error "알 수 없는 명령어: $1"
            echo "사용법: $0 [setup|validate|help]"
            exit 1
            ;;
    esac
}

# 스크립트 실행
main "$@" 
 
 