import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createErrorResponse } from './security';

/**
 * Next.js 15.4.4 JWT 인증 미들웨어
 * 보안을 고려한 인증 시스템
 */

// JWT 시크릿 키 (환경변수에서 가져오기)
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

// JWT 시크릿 키 검증
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

if (JWT_SECRET === 'your-secret-key-change-in-production') {
  console.warn('⚠️  Warning: Using default JWT secret. Please set JWT_SECRET environment variable in production.');
}

// 사용자 타입 정의
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'editor';
  iat: number;
  exp: number;
}

/**
 * JWT 토큰 생성
 */
export function generateToken(user: { id: string; email: string; name: string; role: string }): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );
}

/**
 * JWT 토큰 검증
 */
export function verifyToken(token: string): AuthenticatedUser | null {
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * 비밀번호 해싱
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * 비밀번호 검증
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * 인증 미들웨어
 */
export function authenticateToken(request: NextRequest): AuthenticatedUser | null {
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

/**
 * 권한 검증 미들웨어
 */
export function requireAuth(roles?: string[]): (request: NextRequest) => AuthenticatedUser | null {
  return (request: NextRequest) => {
    const user = authenticateToken(request);
    
    if (!user) {
      return null;
    }

    // 특정 역할이 요구되는 경우
    if (roles && roles.length > 0) {
      if (!roles.includes(user.role)) {
        return null;
      }
    }

    return user;
  };
}

/**
 * 인증 에러 응답 생성
 */
export function createAuthErrorResponse(message: string = '인증이 필요합니다', status: number = 401): NextResponse {
  return createErrorResponse(message, status);
}

/**
 * 권한 에러 응답 생성
 */
export function createPermissionErrorResponse(message: string = '권한이 없습니다', status: number = 403): NextResponse {
  return createErrorResponse(message, status);
}

/**
 * 토큰에서 사용자 정보 추출 (타입 안전)
 */
export function extractUserFromToken(token: string): { user: AuthenticatedUser | null; error?: string } {
  try {
    const user = verifyToken(token);
    if (!user) {
      return { user: null, error: '유효하지 않은 토큰입니다' };
    }
    return { user };
  } catch (error) {
    return { user: null, error: '토큰 검증에 실패했습니다' };
  }
}

/**
 * 리프레시 토큰 생성
 */
export function generateRefreshToken(userId: string): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  
  return jwt.sign(
    { userId, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

/**
 * 리프레시 토큰 검증
 */
export function verifyRefreshToken(token: string): { userId: string } | null {
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; type: string };
    if (decoded.type !== 'refresh') {
      return null;
    }
    return { userId: decoded.userId };
  } catch (error) {
    return null;
  }
}

/**
 * 토큰 블랙리스트 관리 (메모리 기반, 프로덕션에서는 Redis 사용 권장)
 */
const tokenBlacklist = new Set<string>();

export function blacklistToken(token: string): void {
  tokenBlacklist.add(token);
}

export function isTokenBlacklisted(token: string): boolean {
  return tokenBlacklist.has(token);
}

/**
 * 보안 토큰 검증 (블랙리스트 포함)
 */
export function secureVerifyToken(token: string): AuthenticatedUser | null {
  if (isTokenBlacklisted(token)) {
    return null;
  }
  return verifyToken(token);
}

/**
 * 로그아웃 처리
 */
export function logout(token: string): void {
  blacklistToken(token);
}

/**
 * 토큰 만료 시간 확인
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) {
      return true;
    }
    return Date.now() >= decoded.exp * 1000;
  } catch (error) {
    return true;
  }
} 
 
 