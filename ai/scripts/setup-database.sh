#!/bin/bash

# AI 친숙한 데이터베이스 설정 스크립트
# Neon PostgreSQL 기반 shadcn-ui 블로그

set -e  # 오류 발생 시 스크립트 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# 제목 출력
print_header() {
    echo ""
    echo "=" * 60
    echo "🚀 AI 친숙한 데이터베이스 설정"
    echo "=" * 60
    echo ""
}

# 환경변수 확인
check_environment() {
    log_info "환경변수 확인 중..."
    
    local required_vars=(
        "DATABASE_URL"
        "DB_HOST"
        "DB_PORT"
        "DB_NAME"
        "DB_USER"
        "DB_PASSWORD"
    )
    
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        log_error "누락된 환경변수: ${missing_vars[*]}"
        log_info ".env.local 파일을 확인하거나 ./scripts/setup-env.sh를 실행하세요."
        exit 1
    fi
    
    log_success "모든 환경변수가 설정되었습니다."
}

# PostgreSQL 클라이언트 확인
check_postgres_client() {
    log_info "PostgreSQL 클라이언트 확인 중..."
    
    if ! command -v psql &> /dev/null; then
        log_warning "psql이 설치되지 않았습니다."
        
        if [[ "$OSTYPE" == "darwin"* ]]; then
            log_info "macOS에서 PostgreSQL 설치 중..."
            brew install postgresql
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            log_info "Linux에서 PostgreSQL 클라이언트 설치 중..."
            sudo apt-get update
            sudo apt-get install -y postgresql-client
        else
            log_error "지원되지 않는 운영체제입니다."
            exit 1
        fi
    fi
    
    log_success "PostgreSQL 클라이언트가 준비되었습니다."
}

# 데이터베이스 연결 테스트
test_database_connection() {
    log_info "데이터베이스 연결 테스트 중..."
    
    if psql "$DATABASE_URL" -c "SELECT version();" > /dev/null 2>&1; then
        log_success "데이터베이스 연결이 성공했습니다."
        return 0
    else
        log_error "데이터베이스 연결에 실패했습니다."
        return 1
    fi
}

# 마이그레이션 실행
run_migrations() {
    log_info "데이터베이스 마이그레이션 실행 중..."
    
    if npm run migrate; then
        log_success "마이그레이션이 성공적으로 완료되었습니다."
    else
        log_error "마이그레이션 실행 중 오류가 발생했습니다."
        exit 1
    fi
}

# 초기 데이터 삽입
seed_database() {
    log_info "초기 데이터 삽입 중..."
    
    if [[ -f "ai/database/seeds/initial_data.sql" ]]; then
        if psql "$DATABASE_URL" -f "ai/database/seeds/initial_data.sql"; then
            log_success "초기 데이터가 성공적으로 삽입되었습니다."
        else
            log_warning "초기 데이터 삽입 중 오류가 발생했습니다."
        fi
    else
        log_warning "초기 데이터 파일이 없습니다. 건너뜁니다."
    fi
}

# 데이터베이스 상태 확인
check_database_status() {
    log_info "데이터베이스 상태 확인 중..."
    
    echo ""
    echo "📊 데이터베이스 테이블 정보:"
    echo "─" * 40
    
    psql "$DATABASE_URL" -c "
        SELECT 
            schemaname,
            tablename,
            tableowner
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY tablename;
    " 2>/dev/null || log_warning "테이블 정보를 가져올 수 없습니다."
    
    echo ""
    echo "📊 마이그레이션 상태:"
    echo "─" * 40
    
    psql "$DATABASE_URL" -c "
        SELECT 
            version,
            name,
            applied_at
        FROM schema_migrations 
        ORDER BY version;
    " 2>/dev/null || log_warning "마이그레이션 정보를 가져올 수 없습니다."
}

# 메인 실행 함수
main() {
    print_header
    
    # 1단계: 환경변수 확인
    check_environment
    
    # 2단계: PostgreSQL 클라이언트 확인
    check_postgres_client
    
    # 3단계: 데이터베이스 연결 테스트
    if ! test_database_connection; then
        log_error "데이터베이스 연결에 실패했습니다. 설정을 확인하세요."
        exit 1
    fi
    
    # 4단계: 마이그레이션 실행
    run_migrations
    
    # 5단계: 초기 데이터 삽입
    seed_database
    
    # 6단계: 상태 확인
    check_database_status
    
    echo ""
    log_success "🎉 데이터베이스 설정이 완료되었습니다!"
    echo ""
    echo "📋 다음 단계:"
    echo "1. npm run dev (개발 서버 시작)"
    echo "2. 브라우저에서 http://localhost:3000 접속"
    echo "3. 블로그 기능 테스트"
    echo ""
    echo "🔧 유용한 명령어:"
    echo "- npm run migrate:status (마이그레이션 상태 확인)"
    echo "- npm run db:test (데이터베이스 연결 테스트)"
    echo "- psql \"\$DATABASE_URL\" (데이터베이스 직접 접속)"
}

# 스크립트 실행
main "$@" 
 
 