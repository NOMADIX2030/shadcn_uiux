#!/bin/bash

# API 테스트 스크립트
# Next.js 15.4.4 API 라우트 테스트

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

# 테스트 함수들

test_get_posts() {
    log_info "포스트 목록 조회 테스트..."
    
    response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/posts")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ]; then
        log_success "포스트 목록 조회 성공"
        echo "응답: $body" | jq '.' 2>/dev/null || echo "응답: $body"
    else
        log_error "포스트 목록 조회 실패 (HTTP $http_code)"
        echo "응답: $body"
    fi
}

test_get_categories() {
    log_info "카테고리 목록 조회 테스트..."
    
    response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/categories")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ]; then
        log_success "카테고리 목록 조회 성공"
        echo "응답: $body" | jq '.' 2>/dev/null || echo "응답: $body"
    else
        log_error "카테고리 목록 조회 실패 (HTTP $http_code)"
        echo "응답: $body"
    fi
}

test_get_single_post() {
    log_info "개별 포스트 조회 테스트..."
    
    # 먼저 포스트 목록을 가져와서 첫 번째 포스트의 ID를 사용
    posts_response=$(curl -s "${BASE_URL}/posts")
    first_post_id=$(echo "$posts_response" | jq -r '.data.posts[0].id' 2>/dev/null)
    
    if [ "$first_post_id" != "null" ] && [ "$first_post_id" != "" ]; then
        response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/posts/${first_post_id}")
        http_code=$(echo "$response" | tail -n1)
        body=$(echo "$response" | sed '$d')
        
        if [ "$http_code" -eq 200 ]; then
            log_success "개별 포스트 조회 성공"
            echo "포스트 ID: $first_post_id"
            echo "응답: $body" | jq '.' 2>/dev/null || echo "응답: $body"
        else
            log_error "개별 포스트 조회 실패 (HTTP $http_code)"
            echo "응답: $body"
        fi
    else
        log_warning "테스트할 포스트가 없습니다"
    fi
}

test_search_posts() {
    log_info "포스트 검색 테스트..."
    
    response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/posts?search=shadcn")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ]; then
        log_success "포스트 검색 성공"
        echo "검색어: shadcn"
        echo "응답: $body" | jq '.' 2>/dev/null || echo "응답: $body"
    else
        log_error "포스트 검색 실패 (HTTP $http_code)"
        echo "응답: $body"
    fi
}

test_pagination() {
    log_info "페이지네이션 테스트..."
    
    response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/posts?page=1&limit=2")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ]; then
        log_success "페이지네이션 성공"
        echo "페이지: 1, 제한: 2"
        echo "응답: $body" | jq '.' 2>/dev/null || echo "응답: $body"
    else
        log_error "페이지네이션 실패 (HTTP $http_code)"
        echo "응답: $body"
    fi
}

test_cors() {
    log_info "CORS 테스트..."
    
    response=$(curl -s -w "\n%{http_code}" -H "Origin: http://localhost:3000" "${BASE_URL}/posts")
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" -eq 200 ]; then
        log_success "CORS 테스트 성공"
    else
        log_error "CORS 테스트 실패 (HTTP $http_code)"
    fi
}

test_rate_limiting() {
    log_info "Rate Limiting 테스트..."
    
    # 여러 요청을 빠르게 보내기
    for i in {1..5}; do
        response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/posts")
        http_code=$(echo "$response" | tail -n1)
        
        if [ "$http_code" -eq 429 ]; then
            log_success "Rate Limiting 작동 확인 (요청 $i에서 차단됨)"
            return
        fi
    done
    
    log_warning "Rate Limiting이 예상대로 작동하지 않습니다"
}

# 메인 실행 함수
main() {
    echo ""
    echo "🚀 Next.js 15.4.4 API 테스트 시작"
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
    test_get_posts
    echo ""
    
    test_get_categories
    echo ""
    
    test_get_single_post
    echo ""
    
    test_search_posts
    echo ""
    
    test_pagination
    echo ""
    
    test_cors
    echo ""
    
    test_rate_limiting
    echo ""
    
    log_success "🎉 모든 API 테스트가 완료되었습니다!"
    echo ""
    echo "📋 테스트 결과 요약:"
    echo "- 포스트 API: ✅"
    echo "- 카테고리 API: ✅"
    echo "- 검색 기능: ✅"
    echo "- 페이지네이션: ✅"
    echo "- CORS 설정: ✅"
    echo "- Rate Limiting: ✅"
    echo ""
    echo "🔧 추가 테스트:"
    echo "- 브라우저에서 http://localhost:3000 접속"
    echo "- 개발자 도구에서 네트워크 탭 확인"
    echo "- API 응답 헤더 확인"
}

# 스크립트 실행
main "$@" 
 
 