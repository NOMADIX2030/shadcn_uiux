import { NextRequest } from 'next/server';
import { 
  validateApiRequest, 
  createSuccessResponse, 
  createErrorResponse,
  validateInput,
  checkRateLimit,
  logApiRequest
} from '../../../../../ai/api/middleware/security';
import { loginSchema } from '../../../../../ai/api/schemas/validation';
import pool from '../../../../../ai/database/connections/neon-pool';
import { generateToken, hashPassword, verifyPassword } from '../../../../../ai/api/middleware/auth';

/**
 * POST /api/auth/login
 * 사용자 로그인
 */
export async function POST(request: NextRequest) {
  try {
    // API 요청 검증 (로그인은 POST 요청이므로 완화된 검증)
    const validationResult = await validateApiRequest(request);
    if (!validationResult.isValid) {
      console.warn('API 요청 검증 실패:', validationResult.error);
      // 로그인은 POST 요청이므로 완화된 처리
      return createErrorResponse(validationResult.error!, 400);
    }

    // Rate limiting 확인
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await checkRateLimit(ip, 10); // 로그인은 10회 제한
    if (!rateLimitResult) {
      return createErrorResponse('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.', 429);
    }

    // 요청 본문 파싱
    const body = await request.json();
    const validationResult2 = validateInput(body, loginSchema);
    if (!validationResult2.isValid) {
      return createErrorResponse(validationResult2.error!, 400);
    }

    const { email, password } = validationResult2.data as { email: string; password: string };

    // 데이터베이스에서 사용자 조회
    const client = await pool.connect();
    try {
      const userResult = await client.query(
        'SELECT id, email, name, password_hash, role FROM users WHERE email = $1',
        [email]
      );

      if (userResult.rows.length === 0) {
        return createErrorResponse('이메일 또는 비밀번호가 올바르지 않습니다', 401);
      }

      const user = userResult.rows[0];

      // 비밀번호 검증
      const isValidPassword = await verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        return createErrorResponse('이메일 또는 비밀번호가 올바르지 않습니다', 401);
      }

      // JWT 토큰 생성
      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      });

      // 응답 데이터 (비밀번호 제외)
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };

      const response = createSuccessResponse(
        { user: userData, token },
        '로그인에 성공했습니다'
      );

      logApiRequest(request, response);
      return response;

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('POST /api/auth/login error:', error);
    return createErrorResponse('로그인 중 오류가 발생했습니다', 500);
  }
}

/**
 * OPTIONS /api/auth/login
 * CORS preflight 요청 처리
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 