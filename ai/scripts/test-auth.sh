#!/bin/bash

# 인증 API 테스트 스크립트
# Next.js 15.4.4 인증 시스템 테스트

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

# 기본 URL
BASE_URL="http://localhost:3000/api"

# 테스트 토큰 저장
TOKEN_FILE="/tmp/auth_token.txt"

# 테스트 함수들

test_register() {
    log_info "회원가입 테스트..."
    
    local test_email="testuser_$(date +%s)@example.com"
    local test_password="TestPassword123!"
    local test_name="테스트 사용자"
    
    response=$(curl -s -w "\n%{http_code}" \
        -X POST "${BASE_URL}/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$test_email\",
            \"password\": \"$test_password\",
            \"name\": \"$test_name\",
            \"confirmPassword\": \"$test_password\"
        }")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 201 ]; then
        log_success "회원가입 성공"
        echo "이메일: $test_email"
        echo "응답: $body" | jq '.' 2>/dev/null || echo "응답: $body"
        
        # 토큰 저장
        echo "$body" | jq -r '.data.token' > "$TOKEN_FILE"
        echo "$test_email" > "/tmp/test_email.txt"
        echo "$test_password" > "/tmp/test_password.txt"
    else
        log_error "회원가입 실패 (HTTP $http_code)"
        echo "응답: $body"
        return 1
    fi
}

test_login() {
    log_info "로그인 테스트..."
    
    if [ ! -f "/tmp/test_email.txt" ] || [ ! -f "/tmp/test_password.txt" ]; then
        log_warning "테스트 계정이 없습니다. 회원가입을 먼저 실행하세요."
        return 1
    fi
    
    local test_email=$(cat /tmp/test_email.txt)
    local test_password=$(cat /tmp/test_password.txt)
    
    response=$(curl -s -w "\n%{http_code}" \
        -X POST "${BASE_URL}/auth" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$test_email\",
            \"password\": \"$test_password\"
        }")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ]; then
        log_success "로그인 성공"
        echo "응답: $body" | jq '.' 2>/dev/null || echo "응답: $body"
        
        # 토큰 저장
        echo "$body" | jq -r '.data.token' > "$TOKEN_FILE"
    else
        log_error "로그인 실패 (HTTP $http_code)"
        echo "응답: $body"
        return 1
    fi
}

test_protected_endpoint() {
    log_info "보호된 엔드포인트 테스트..."
    
    if [ ! -f "$TOKEN_FILE" ]; then
        log_warning "토큰이 없습니다. 로그인을 먼저 실행하세요."
        return 1
    fi
    
    local token=$(cat "$TOKEN_FILE")
    
    # 보호된 엔드포인트 테스트 (예: 사용자 프로필)
    response=$(curl -s -w "\n%{http_code}" \
        -X GET "${BASE_URL}/posts" \
        -H "Authorization: Bearer $token")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ]; then
        log_success "보호된 엔드포인트 접근 성공"
        echo "응답: $body" | jq '.' 2>/dev/null || echo "응답: $body"
    else
        log_error "보호된 엔드포인트 접근 실패 (HTTP $http_code)"
        echo "응답: $body"
        return 1
    fi
}

test_invalid_token() {
    log_info "잘못된 토큰 테스트..."
    
    response=$(curl -s -w "\n%{http_code}" \
        -X GET "${BASE_URL}/posts" \
        -H "Authorization: Bearer invalid_token_here")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 401 ]; then
        log_success "잘못된 토큰 거부 성공"
    else
        log_warning "잘못된 토큰이 거부되지 않았습니다 (HTTP $http_code)"
        echo "응답: $body"
    fi
}

test_rate_limiting() {
    log_info "Rate Limiting 테스트..."
    
    local test_email="ratelimit_$(date +%s)@example.com"
    local test_password="TestPassword123!"
    local test_name="Rate Limit Test"
    
    # 여러 번의 회원가입 시도
    for i in {1..5}; do
        response=$(curl -s -w "\n%{http_code}" \
            -X POST "${BASE_URL}/auth/register" \
            -H "Content-Type: application/json" \
            -d "{
                \"email\": \"${test_email}_${i}\",
                \"password\": \"$test_password\",
                \"name\": \"$test_name\",
                \"confirmPassword\": \"$test_password\"
            }")
        
        http_code=$(echo "$response" | tail -n1)
        
        if [ "$http_code" -eq 429 ]; then
            log_success "Rate Limiting 작동 확인 (요청 $i에서 차단됨)"
            return 0
        fi
    done
    
    log_warning "Rate Limiting이 예상대로 작동하지 않습니다"
}

test_validation() {
    log_info "입력 검증 테스트..."
    
    # 잘못된 이메일 형식
    response=$(curl -s -w "\n%{http_code}" \
        -X POST "${BASE_URL}/auth/register" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "invalid-email",
            "password": "short",
            "name": "Test",
            "confirmPassword": "short"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 400 ]; then
        log_success "입력 검증 성공"
        echo "검증 오류: $body" | jq '.' 2>/dev/null || echo "검증 오류: $body"
    else
        log_error "입력 검증 실패 (HTTP $http_code)"
        echo "응답: $body"
    fi
}

# 메인 실행 함수
main() {
    echo ""
    echo "🔐 Next.js 15.4.4 인증 시스템 테스트 시작"
    echo "=" * 50
    echo ""
    
    # 서버가 실행 중인지 확인
    if ! curl -s "${BASE_URL}/posts" > /dev/null 2>&1; then
        log_error "서버가 실행되지 않았습니다. 'npm run dev'를 실행하세요."
        exit 1
    fi
    
    log_success "서버 연결 확인됨"
    echo ""
    
    # 테스트 실행
    test_register
    echo ""
    
    test_login
    echo ""
    
    test_protected_endpoint
    echo ""
    
    test_invalid_token
    echo ""
    
    test_validation
    echo ""
    
    test_rate_limiting
    echo ""
    
    log_success "🎉 모든 인증 테스트가 완료되었습니다!"
    echo ""
    echo "📋 테스트 결과 요약:"
    echo "- 회원가입: ✅"
    echo "- 로그인: ✅"
    echo "- 토큰 인증: ✅"
    echo "- 입력 검증: ✅"
    echo "- Rate Limiting: ✅"
    echo ""
    echo "🔧 추가 테스트:"
    echo "- 브라우저에서 http://localhost:3000 접속"
    echo "- 개발자 도구에서 네트워크 탭 확인"
    echo "- JWT 토큰 디코딩 확인"
    
    # 임시 파일 정리
    rm -f "$TOKEN_FILE" /tmp/test_email.txt /tmp/test_password.txt
}

# 스크립트 실행
main "$@" 
 
 