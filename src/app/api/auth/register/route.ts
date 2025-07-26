import { NextRequest } from 'next/server';
import { 
  validateApiRequest, 
  createSuccessResponse, 
  createErrorResponse,
  validateInput,
  checkRateLimit,
  logApiRequest
} from '../../../../../ai/api/middleware/security';
import { 
  generateToken, 
  hashPassword,
  createAuthErrorResponse
} from '../../../../../ai/api/middleware/auth';
import { registerSchema } from '../../../../../ai/api/schemas/validation';
import pool from '../../../../../ai/database/connections/neon-pool';

/**
 * POST /api/auth/register
 * 사용자 회원가입
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 검증
    const validation = await validateApiRequest(request);
    if (!validation.isValid) {
      return createErrorResponse(validation.error!, 400);
    }

    // Rate limiting (회원가입은 더 엄격하게)
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIp, 3, 600000)) { // 10분에 3회
      return createErrorResponse('Too many registration attempts', 429);
    }

    // 요청 본문 파싱
    const body = await request.json();

    // 입력 검증
    const validationResult = validateInput(body, registerSchema);
    if (!validationResult.isValid) {
      return createErrorResponse(validationResult.error!, 400);
    }

    const { email, password, name } = validationResult.data as { email: string; password: string; name: string };

    // 이메일 중복 확인
    const existingUserSql = 'SELECT id FROM users WHERE email = $1';
    const existingUserResult = await pool.query(existingUserSql, [email]);

    if (existingUserResult.rows.length > 0) {
      return createAuthErrorResponse('이미 사용 중인 이메일입니다');
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password);

    // 트랜잭션 시작
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // 사용자 생성
      const createUserSql = `
        INSERT INTO users (email, name, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, name, role, avatar_url, bio
      `;

      const createUserResult = await client.query(createUserSql, [
        email,
        name,
        hashedPassword,
        'user', // 기본 역할
      ]);

      const newUser = createUserResult.rows[0];

      // JWT 토큰 생성
      const token = generateToken({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      });

      await client.query('COMMIT');

      // 응답 데이터 (비밀번호 제외)
      const userData = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        avatar_url: newUser.avatar_url,
        bio: newUser.bio,
      };

      const response = {
        user: userData,
        token,
        expiresIn: '7d',
      };

      const apiResponse = createSuccessResponse(response, '회원가입이 성공했습니다', 201);
      logApiRequest(request, apiResponse);
      
      return apiResponse;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('POST /api/auth/register error:', error);
    
    // 중복 이메일 에러 처리
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return createAuthErrorResponse('이미 사용 중인 이메일입니다');
    }
    
    return createErrorResponse('회원가입 중 오류가 발생했습니다', 500);
  }
}

/**
 * OPTIONS /api/auth/register
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
 
 