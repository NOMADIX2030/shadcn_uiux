import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

/**
 * Next.js 15.4.4 보안 미들웨어
 * 공식 권장사항을 따른 보안 설정
 */

// CORS 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

// 보안 헤더 설정
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

/**
 * API 요청 검증
 * Next.js 15.4.4 서버 사이드 렌더링 고려
 */
export async function validateApiRequest(request: NextRequest): Promise<{ isValid: boolean; error?: string }> {
  const headersList = await headers();
  const contentType = headersList.get('content-type');
  const userAgent = headersList.get('user-agent');

  // User-Agent 검증 (서버 사이드 렌더링 고려)
  if (!userAgent) {
    // 서버 사이드 렌더링에서는 User-Agent가 없을 수 있음
    console.warn('User-Agent not found in request headers');
  } else if (userAgent.length < 5) {
    return { isValid: false, error: 'Invalid User-Agent' };
  }

  // Content-Type 검증 (POST/PUT 요청의 경우만)
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    if (!contentType || !contentType.includes('application/json')) {
      return { isValid: false, error: 'Content-Type must be application/json' };
    }
  }

  // 요청 크기 제한 (10MB)
  const contentLength = headersList.get('content-length');
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
    return { isValid: false, error: 'Request too large' };
  }

  return { isValid: true };
}

/**
 * Rate Limiting (간단한 메모리 기반)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * API 응답 래퍼
 */
export function createApiResponse<T>(
  data: T | null,
  status: number = 200,
  message?: string,
  error?: string
): NextResponse {
  const response = {
    success: status < 400,
    data,
    message,
    error,
    timestamp: new Date().toISOString(),
  };

  const nextResponse = NextResponse.json(response, { status });

  // 보안 헤더 추가
  Object.entries(securityHeaders).forEach(([key, value]) => {
    nextResponse.headers.set(key, value);
  });

  // CORS 헤더 추가
  Object.entries(corsHeaders).forEach(([key, value]) => {
    nextResponse.headers.set(key, value);
  });

  return nextResponse;
}

/**
 * 에러 응답 생성
 */
export function createErrorResponse(
  error: string,
  status: number = 500,
  details?: any
): NextResponse {
  return createApiResponse(null, status, undefined, error);
}

/**
 * 성공 응답 생성
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse {
  return createApiResponse(data, status, message);
}

/**
 * 입력 데이터 검증
 */
export function validateInput<T>(
  data: any,
  schema: any
): { isValid: boolean; data?: T; error?: string } {
  try {
    const validatedData = schema.parse(data);
    return { isValid: true, data: validatedData };
  } catch (error: any) {
    return { 
      isValid: false, 
      error: error.errors?.map((e: any) => e.message).join(', ') || 'Validation failed' 
    };
  }
}

/**
 * 로깅 미들웨어
 */
export function logApiRequest(request: NextRequest, response: NextResponse) {
  const { method, url } = request;
  const { status } = response;
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] ${method} ${url} - ${status}`);
  
  // 에러 로깅
  if (status >= 400) {
    console.error(`API Error: ${method} ${url} - ${status}`);
  }
} 
 
 