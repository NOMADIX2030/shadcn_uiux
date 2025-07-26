import { NextRequest } from 'next/server';
import { 
  validateApiRequest, 
  createSuccessResponse, 
  createErrorResponse,
  checkRateLimit,
  logApiRequest
} from '../../../../ai/api/middleware/security';
import pool from '../../../../ai/database/connections/neon-pool';

/**
 * GET /api/tags
 * 태그 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    // GET 요청은 보안 검증 완화
    const validation = await validateApiRequest(request);
    if (!validation.isValid) {
      console.warn('API 검증 경고:', validation.error);
    }

    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIp, 200, 60000)) {
      return createErrorResponse('Too many requests', 429);
    }

    // 태그 조회 쿼리
    const sql = `
      SELECT 
        id,
        name,
        slug,
        created_at
      FROM tags
      ORDER BY name ASC
    `;

    const result = await pool.query(sql);
    const tags = result.rows;

    const response = {
      tags,
      total: tags.length
    };

    const apiResponse = createSuccessResponse(response, '태그 목록을 성공적으로 조회했습니다');
    logApiRequest(request, apiResponse);
    
    return apiResponse;

  } catch (error) {
    console.error('GET /api/tags error:', error);
    return createErrorResponse('태그 목록 조회 중 오류가 발생했습니다', 500);
  }
}

/**
 * POST /api/tags
 * 새 태그 생성
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 검증
    const validation = await validateApiRequest(request);
    if (!validation.isValid) {
      return createErrorResponse(validation.error!, 400);
    }

    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIp, 10, 60000)) {
      return createErrorResponse('Too many requests', 429);
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return createErrorResponse('태그 이름은 필수입니다', 400);
    }

    // 슬러그 생성
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // 태그 생성
    const sql = `
      INSERT INTO tags (name, slug)
      VALUES ($1, $2)
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name
      RETURNING *
    `;

    const result = await pool.query(sql, [name.trim(), slug]);
    const newTag = result.rows[0];

    const apiResponse = createSuccessResponse(newTag, '태그가 성공적으로 생성되었습니다', 201);
    logApiRequest(request, apiResponse);
    
    return apiResponse;

  } catch (error) {
    console.error('POST /api/tags error:', error);
    return createErrorResponse('태그 생성 중 오류가 발생했습니다', 500);
  }
}

/**
 * OPTIONS /api/tags
 * CORS preflight 요청 처리
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
    },
  });
} 