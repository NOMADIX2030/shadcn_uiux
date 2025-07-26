import { NextRequest } from 'next/server';
import { 
  validateApiRequest, 
  createSuccessResponse, 
  createErrorResponse,
  validateInput,
  checkRateLimit,
  logApiRequest
} from '../../../../ai/api/middleware/security';
import { 
  generateToken, 
  hashPassword, 
  verifyPassword,
  createAuthErrorResponse
} from '../../../../ai/api/middleware/auth';
import { loginSchema, registerSchema } from '../../../../ai/api/schemas/validation';
import pool from '../../../../ai/database/connections/neon-pool';

/**
 * POST /api/auth/login
 * 사용자 로그인
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 검증
    const validation = await validateApiRequest(request);
    if (!validation.isValid) {
      return createErrorResponse(validation.error!, 400);
    }

    // Rate limiting (로그인은 더 엄격하게)
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIp, 5, 300000)) { // 5분에 5회
      return createErrorResponse('Too many login attempts', 429);
    }

    // 요청 본문 파싱
    const body = await request.json();

    // 입력 검증
    const validationResult = validateInput(body, loginSchema);
    if (!validationResult.isValid) {
      return createErrorResponse(validationResult.error!, 400);
    }

    const { email, password } = validationResult.data as { email: string; password: string };

    // 사용자 조회
    const userSql = `
      SELECT id, email, name, password_hash, role, avatar_url, bio
      FROM users 
      WHERE email = $1
    `;

    const userResult = await pool.query(userSql, [email]);

    if (userResult.rows.length === 0) {
      return createAuthErrorResponse('이메일 또는 비밀번호가 올바르지 않습니다');
    }

    const user = userResult.rows[0];

    // 비밀번호 검증
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return createAuthErrorResponse('이메일 또는 비밀번호가 올바르지 않습니다');
    }

    // JWT 토큰 생성
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'user',
    });

    // 응답 데이터 (비밀번호 제외)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'user',
      avatar_url: user.avatar_url,
      bio: user.bio,
    };

    const response = {
      user: userData,
      token,
      expiresIn: '7d',
    };

    const apiResponse = createSuccessResponse(response, '로그인이 성공했습니다');
    logApiRequest(request, apiResponse);
    
    return apiResponse;

  } catch (error) {
    console.error('POST /api/auth/login error:', error);
    return createErrorResponse('로그인 중 오류가 발생했습니다', 500);
  }
}

/**
 * OPTIONS /api/auth
 * CORS preflight 요청 처리
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
    },
  });
} 
 
 