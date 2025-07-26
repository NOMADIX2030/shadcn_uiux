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
  createPostSchema, 
  paginationSchema,
  type CreatePostInput,
  type PaginationParams 
} from '../../../../ai/api/schemas/validation';
import pool from '../../../../ai/database/connections/neon-pool';
import { getUserFromRequest } from '../../../lib/auth';

/**
 * GET /api/posts
 * 포스트 목록 조회 (페이지네이션, 검색, 필터링 지원)
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
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.featured_image,
        p.featured,
        p.published_at,
        p.reading_time,
        p.views,
        p.likes,
        p.status,
        u.name as author_name,
        u.avatar_url as author_avatar,
        c.name as category_name,
        c.slug as category_slug,
        c.color as category_color,
        COUNT(DISTINCT cm.id) as comment_count
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN comments cm ON p.id = cm.post_id
      WHERE p.status = 'published'
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // 검색 조건 추가
    if (search) {
      sql += ` AND (p.title ILIKE $${paramIndex} OR p.excerpt ILIKE $${paramIndex} OR p.content ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // 그룹화 및 정렬
    sql += ` GROUP BY p.id, u.name, u.avatar_url, c.name, c.slug, c.color`;
    
    if (sortBy) {
      sql += ` ORDER BY p.${sortBy} ${sort.toUpperCase()}`;
    } else {
      sql += ` ORDER BY p.published_at ${sort.toUpperCase()}`;
    }

    // 페이지네이션
    sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    // 쿼리 실행
    const result = await pool.query(sql, params);

    // 전체 개수 조회
    let countSql = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM posts p
      WHERE p.status = 'published'
    `;

    if (search) {
      countSql += ` AND (p.title ILIKE $1 OR p.excerpt ILIKE $1 OR p.content ILIKE $1)`;
    }

    const countResult = await pool.query(countSql, search ? [`%${search}%`] : []);
    const total = parseInt(countResult.rows[0].total);

    // 응답 데이터 구성
    const response = {
      posts: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };

    const apiResponse = createSuccessResponse(response, '포스트 목록을 성공적으로 조회했습니다');
    logApiRequest(request, apiResponse);
    
    return apiResponse;

  } catch (error) {
    console.error('GET /api/posts error:', error);
    return createErrorResponse('포스트 목록 조회 중 오류가 발생했습니다', 500);
  }
}

/**
 * POST /api/posts
 * 새 포스트 생성
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
    console.log('받은 요청 데이터:', body);
    
    const validationResult = validateInput(body, createPostSchema);
    if (!validationResult.isValid) {
      console.error('검증 실패:', validationResult.error);
      return createErrorResponse(validationResult.error!, 400);
    }

    const postData = validationResult.data as CreatePostInput;
    console.log('검증된 데이터:', postData);

    // 슬러그 검증 및 정규화
    if (postData.slug) {
      const normalizedSlug = postData.slug
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '') // 영문/숫자/하이픈만 허용
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') // 앞뒤 하이픈 제거
        .trim();
      
      if (normalizedSlug.length < 3) {
        return createErrorResponse('슬러그는 최소 3자 이상이어야 합니다', 400);
      }
      
      postData.slug = normalizedSlug;
    }

    // 인증 확인
    const user = getUserFromRequest(request);
    if (!user) {
      return createErrorResponse('인증이 필요합니다', 401);
    }

    // 트랜잭션 시작
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // 포스트 생성
      const postSql = `
        INSERT INTO posts (
          title, slug, excerpt, content, author_id, category_id, 
          featured_image, featured, status, reading_time, published_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;

      const readingTime = postData.reading_time || Math.ceil(postData.content.length / 200);
      const publishedAt = postData.status === 'published' ? (postData.published_at || new Date().toISOString()) : null;

      console.log('포스트 생성 쿼리 파라미터:', [
        postData.title,
        postData.slug,
        postData.excerpt,
        postData.content,
        postData.author_id,
        postData.category_id,
        postData.featured_image,
        postData.featured,
        postData.status,
        readingTime,
        publishedAt,
      ]);

      const postResult = await client.query(postSql, [
        postData.title,
        postData.slug,
        postData.excerpt,
        postData.content,
        postData.author_id,
        postData.category_id,
        postData.featured_image,
        postData.featured,
        postData.status,
        readingTime,
        publishedAt,
      ]);

      const newPost = postResult.rows[0];
      console.log('생성된 포스트:', newPost);

      // 태그 연결 (태그가 있는 경우)
      if (postData.tags && postData.tags.length > 0) {
        // 태그 이름으로 태그 ID 찾기 또는 새로 생성
        for (const tagName of postData.tags) {
          // 기존 태그 확인
          let tagResult = await client.query(
            'SELECT id FROM tags WHERE name = $1',
            [tagName]
          );
          
          let tagId;
          if (tagResult.rows.length > 0) {
            tagId = tagResult.rows[0].id;
          } else {
            // 새 태그 생성
            const slug = tagName
              .toLowerCase()
              .replace(/[^a-z0-9가-힣\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim();
            
            const newTagResult = await client.query(
              'INSERT INTO tags (name, slug) VALUES ($1, $2) RETURNING id',
              [tagName, slug]
            );
            tagId = newTagResult.rows[0].id;
          }
          
          // 포스트-태그 연결
          await client.query(
            'INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [newPost.id, tagId]
          );
        }
      }

      await client.query('COMMIT');

      const apiResponse = createSuccessResponse(newPost, '포스트가 성공적으로 생성되었습니다', 201);
      logApiRequest(request, apiResponse);
      
      return apiResponse;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('POST /api/posts error:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    // 중복 슬러그 에러 처리
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return createErrorResponse('이미 사용 중인 슬러그입니다', 409);
    }
    
    // 외래키 제약 조건 에러 처리
    if (error instanceof Error && error.message.includes('foreign key')) {
      return createErrorResponse('존재하지 않는 카테고리 또는 사용자입니다', 400);
    }
    
    return createErrorResponse(`포스트 생성 중 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
  }
}

/**
 * OPTIONS /api/posts
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
 
