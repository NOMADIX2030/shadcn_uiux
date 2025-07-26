import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: string;
}

// JWT 토큰에서 사용자 정보 추출
export function verifyToken(token: string): AuthUser | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET이 설정되지 않았습니다');
      return null;
    }

    const decoded = jwt.verify(token, secret) as AuthUser;
    return decoded;
  } catch (error) {
    console.error('토큰 검증 실패:', error);
    return null;
  }
}

// 요청에서 토큰 추출
export function extractTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// 요청에서 사용자 정보 추출
export function getUserFromRequest(request: NextRequest): AuthUser | null {
  const token = extractTokenFromRequest(request);
  if (!token) return null;
  
  return verifyToken(token);
}

// 클라이언트 사이드에서 토큰 가져오기
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

// 클라이언트 사이드에서 사용자 정보 가져오기
export function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('사용자 정보 파싱 실패:', error);
    return null;
  }
}

// 로그아웃
export function logout(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
}

// 인증 상태 확인
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  const user = getAuthUser();
  return !!(token && user);
} 