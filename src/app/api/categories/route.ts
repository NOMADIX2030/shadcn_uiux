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
  createCategorySchema, 
  paginationSchema,
  type CreateCategoryInput,
  type PaginationParams 
} from '../../../../ai/api/schemas/validation';
import pool from '../../../../ai/database/connections/neon-pool';

/**
 * GET /api/categories
 * 카테고리 목록 조회 (포스트 수 포함)
 */
export async function GET(request: NextRequest) {
  try {
    // GET 요청은 보안 검증 완화 (서버 사이드 렌더링 고려)
    const validation = await validateApiRequest(request);
    if (!validation.isValid) {
      console.warn('API 검증 경고:', validation.error);
      // GET 요청은 검증 실패해도 계속 진행
    }

    // Rate limiting (GET 요청은 더 관대하게)
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIp, 200, 60000)) {
      return createErrorResponse('Too many requests', 429);
    }

    // 쿼리 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    // 입력 검증
    const validationResult = validateInput(queryParams, paginationSchema);
    if (!validationResult.isValid) {
      return createErrorResponse(validationResult.error!, 400);
    }

    const { page, limit, search, sort, sortBy } = validationResult.data as PaginationParams;
    const offset = (page - 1) * limit;

    // SQL 쿼리 구성
    let sql = `
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.description,
        c.color,
        c.post_count,
        c.created_at,
        c.updated_at,
        COUNT(DISTINCT p.id) as actual_post_count
      FROM categories c
      LEFT JOIN posts p ON c.id = p.category_id AND p.status = 'published'
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // 검색 조건 추가
    if (search) {
      sql += ` WHERE (c.name ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // 그룹화 및 정렬
    sql += ` GROUP BY c.id`;
    
    if (sortBy) {
      sql += ` ORDER BY c.${sortBy} ${sort.toUpperCase()}`;
    } else {
      sql += ` ORDER BY c.post_count ${sort.toUpperCase()}`;
    }

    // 페이지네이션
    sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    // 쿼리 실행
    const result = await pool.query(sql, params);

    // 전체 개수 조회
    let countSql = `SELECT COUNT(*) as total FROM categories`;
    if (search) {
      countSql += ` WHERE (name ILIKE $1 OR description ILIKE $1)`;
    }

    const countResult = await pool.query(countSql, search ? [`%${search}%`] : []);
    const total = parseInt(countResult.rows[0].total);

    // 응답 데이터 구성
    const response = {
      categories: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };

    const apiResponse = createSuccessResponse(response, '카테고리 목록을 성공적으로 조회했습니다');
    logApiRequest(request, apiResponse);
    
    return apiResponse;

  } catch (error) {
    console.error('GET /api/categories error:', error);
    return createErrorResponse('카테고리 목록 조회 중 오류가 발생했습니다', 500);
  }
}

/**
 * POST /api/categories
 * 새 카테고리 생성
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

    // 입력 검증
    const validationResult = validateInput(body, createCategorySchema);
    if (!validationResult.isValid) {
      return createErrorResponse(validationResult.error!, 400);
    }

    const categoryData = validationResult.data as CreateCategoryInput;

    // 카테고리 생성
    const sql = `
      INSERT INTO categories (name, slug, description, color)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await pool.query(sql, [
      categoryData.name,
      categoryData.slug,
      categoryData.description,
      categoryData.color,
    ]);

    const apiResponse = createSuccessResponse(result.rows[0], '카테고리가 성공적으로 생성되었습니다', 201);
    logApiRequest(request, apiResponse);
    
    return apiResponse;

  } catch (error) {
    console.error('POST /api/categories error:', error);
    
    // 중복 슬러그 에러 처리
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return createErrorResponse('이미 사용 중인 슬러그입니다', 409);
    }
    
    return createErrorResponse('카테고리 생성 중 오류가 발생했습니다', 500);
  }
}

/**
 * OPTIONS /api/categories
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
 
 