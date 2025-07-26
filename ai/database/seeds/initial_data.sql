-- Initial Data Seed
-- AI 친숙한 블로그 초기 데이터

BEGIN;

-- 사용자 데이터 삽입
INSERT INTO users (id, email, name, avatar_url, bio) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'admin@shadcn-blog.com',
    '관리자',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'shadcn-ui 블로그 관리자입니다. 프론트엔드 개발과 UI/UX에 관심이 많습니다.'
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'writer@shadcn-blog.com',
    '기술 작가',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'Next.js와 React 생태계에 대한 기술 글을 작성합니다.'
);

-- 카테고리 데이터 삽입
INSERT INTO categories (id, name, slug, description, color) VALUES
(
    '550e8400-e29b-41d4-a716-446655440003',
    '프론트엔드',
    'frontend',
    'React, Next.js, TypeScript 등 프론트엔드 개발 관련 글',
    'bg-blue-500'
),
(
    '550e8400-e29b-41d4-a716-446655440004',
    '백엔드',
    'backend',
    'Node.js, PostgreSQL, API 개발 등 백엔드 개발 관련 글',
    'bg-green-500'
),
(
    '550e8400-e29b-41d4-a716-446655440005',
    'UI/UX',
    'ui-ux',
    '사용자 인터페이스와 사용자 경험 디자인 관련 글',
    'bg-purple-500'
),
(
    '550e8400-e29b-41d4-a716-446655440006',
    '개발 도구',
    'dev-tools',
    '개발 생산성을 높이는 도구와 팁',
    'bg-orange-500'
);

-- 태그 데이터 삽입
INSERT INTO tags (id, name, slug) VALUES
('550e8400-e29b-41d4-a716-446655440007', 'React', 'react'),
('550e8400-e29b-41d4-a716-446655440008', 'Next.js', 'nextjs'),
('550e8400-e29b-41d4-a716-446655440009', 'TypeScript', 'typescript'),
('550e8400-e29b-41d4-a716-446655440010', 'Tailwind CSS', 'tailwind-css'),
('550e8400-e29b-41d4-a716-446655440011', 'shadcn/ui', 'shadcn-ui'),
('550e8400-e29b-41d4-a716-446655440012', 'PostgreSQL', 'postgresql'),
('550e8400-e29b-41d4-a716-446655440013', 'Neon', 'neon'),
('550e8400-e29b-41d4-a716-446655440014', '데이터베이스', 'database');

-- 포스트 데이터 삽입
INSERT INTO posts (id, title, slug, excerpt, content, author_id, category_id, featured_image, featured, published_at, reading_time, views, likes, status) VALUES
(
    '550e8400-e29b-41d4-a716-446655440015',
    'shadcn/ui로 모던한 블로그 구축하기',
    'building-modern-blog-with-shadcn-ui',
    'Next.js와 shadcn/ui를 사용하여 현대적이고 아름다운 블로그를 구축하는 방법을 알아봅니다.',
    '# shadcn/ui로 모던한 블로그 구축하기

## 소개

shadcn/ui는 Radix UI와 Tailwind CSS를 기반으로 한 재사용 가능한 컴포넌트 라이브러리입니다. 이 글에서는 shadcn/ui를 사용하여 현대적이고 아름다운 블로그를 구축하는 방법을 단계별로 설명합니다.

## 준비사항

- Node.js 18+ 
- Next.js 15+
- TypeScript
- Tailwind CSS

## 설치 및 설정

```bash
npx create-next-app@latest my-blog --typescript --tailwind --app
cd my-blog
npx shadcn@latest init
```

## 주요 컴포넌트

### 1. 카드 컴포넌트
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function BlogCard({ post }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>{post.excerpt}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{post.content}</p>
      </CardContent>
    </Card>
  )
}
```

### 2. 네비게이션
```tsx
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"

export function MainNavigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>블로그</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/blog">모든 글</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
```

## 데이터베이스 연동

Neon PostgreSQL을 사용하여 서버리스 데이터베이스를 구축합니다.

```typescript
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

export async function getPosts() {
  const result = await pool.query('SELECT * FROM posts WHERE status = $1', ['published'])
  return result.rows
}
```

## 성능 최적화

1. **이미지 최적화**: Next.js Image 컴포넌트 사용
2. **코드 분할**: 동적 import 활용
3. **캐싱**: ISR과 SSG 적절히 활용

## 배포

Vercel을 사용하여 간편하게 배포할 수 있습니다.

```bash
npm run build
vercel --prod
```

## 결론

shadcn/ui를 사용하면 빠르고 아름다운 블로그를 구축할 수 있습니다. 컴포넌트의 재사용성과 커스터마이징 가능성은 개발 생산성을 크게 향상시킵니다.

앞으로 더 많은 컴포넌트와 기능을 추가하여 블로그를 발전시켜 나가겠습니다.',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440003',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
    true,
    NOW() - INTERVAL '2 days',
    8,
    150,
    25,
    'published'
),
(
    '550e8400-e29b-41d4-a716-446655440016',
    'Neon PostgreSQL로 서버리스 데이터베이스 구축',
    'building-serverless-database-with-neon-postgresql',
    'Neon의 서버리스 PostgreSQL을 사용하여 확장 가능하고 안전한 데이터베이스를 구축하는 방법을 알아봅니다.',
    '# Neon PostgreSQL로 서버리스 데이터베이스 구축

## Neon이란?

Neon은 서버리스 PostgreSQL 서비스로, 다음과 같은 특징을 가지고 있습니다:

- **서버리스**: 인프라 관리 불필요
- **자동 스케일링**: 트래픽에 따라 자동 확장
- **브랜치 기능**: 개발/스테이징 환경 분리
- **무료 티어**: 월 3GB 스토리지, 10GB 전송

## 계정 생성 및 프로젝트 설정

1. [Neon Console](https://console.neon.tech)에 접속
2. GitHub 계정으로 로그인
3. 새 프로젝트 생성
4. 데이터베이스 연결 정보 확인

## 연결 설정

```typescript
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
})
```

## 스키마 설계

```sql
-- 사용자 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 포스트 테이블
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 마이그레이션 시스템

```typescript
class DatabaseMigrator {
  async migrate() {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      // 마이그레이션 실행
      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }
}
```

## 보안 고려사항

1. **SSL 연결**: 모든 연결에 SSL 사용
2. **환경변수**: 민감한 정보는 환경변수로 관리
3. **연결 풀**: 적절한 연결 풀 설정
4. **권한 관리**: 최소 권한 원칙 적용

## 모니터링

Neon Console에서 다음 정보를 확인할 수 있습니다:

- 연결 수
- 쿼리 성능
- 스토리지 사용량
- 네트워크 전송량

## 결론

Neon PostgreSQL은 현대적인 웹 애플리케이션에 이상적인 데이터베이스 솔루션입니다. 서버리스 아키텍처와 자동 스케일링 기능으로 개발자는 비즈니스 로직에만 집중할 수 있습니다.',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440004',
    'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop',
    true,
    NOW() - INTERVAL '1 day',
    10,
    89,
    12,
    'published'
),
(
    '550e8400-e29b-41d4-a716-446655440017',
    'TypeScript로 타입 안전한 API 구축하기',
    'building-type-safe-api-with-typescript',
    'TypeScript를 사용하여 런타임 오류를 방지하고 개발 생산성을 향상시키는 방법을 알아봅니다.',
    '# TypeScript로 타입 안전한 API 구축하기

## TypeScript의 장점

TypeScript는 JavaScript에 정적 타입 시스템을 추가하여 다음과 같은 이점을 제공합니다:

- **타입 안전성**: 컴파일 타임에 오류 발견
- **개발자 경험**: 자동완성과 리팩토링 지원
- **문서화**: 타입이 곧 문서 역할
- **유지보수성**: 대규모 프로젝트에서 효과적

## 기본 타입 정의

```typescript
// 사용자 타입
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// 포스트 타입
interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  publishedAt: Date;
  status: 'draft' | 'published' | 'archived';
}

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

## API 라우트 구현

```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// 입력 검증 스키마
const CreatePostSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  authorId: z.string().uuid()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CreatePostSchema.parse(body)
    
    // 데이터베이스에 저장
    const post = await createPost(validatedData)
    
    return NextResponse.json({
      success: true,
      data: post
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: '입력 데이터가 유효하지 않습니다.',
        details: error.errors
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: '서버 오류가 발생했습니다.'
    }, { status: 500 })
  }
}
```

## 데이터베이스 타입 안전성

```typescript
// 데이터베이스 쿼리 함수
async function getPostById(id: string): Promise<Post | null> {
  const result = await pool.query<Post>(
    'SELECT * FROM posts WHERE id = $1',
    [id]
  )
  return result.rows[0] || null
}

async function createPost(data: CreatePostInput): Promise<Post> {
  const result = await pool.query<Post>(
    'INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
    [data.title, data.content, data.authorId]
  )
  return result.rows[0]
}
```

## 에러 처리

```typescript
// 커스텀 에러 클래스
class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}

// 에러 처리 함수
function handleDatabaseError(error: unknown): never {
  if (error instanceof DatabaseError) {
    throw error
  }
  
  console.error('Unexpected database error:', error)
  throw new DatabaseError('데이터베이스 오류가 발생했습니다.', 'UNKNOWN_ERROR')
}
```

## 테스트 작성

```typescript
// Jest + TypeScript 테스트
describe('Post API', () => {
  it('should create a new post with valid data', async () => {
    const postData = {
      title: 'Test Post',
      content: 'Test content',
      authorId: 'test-author-id'
    }
    
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    })
    
    const result = await response.json()
    
    expect(response.status).toBe(200)
    expect(result.success).toBe(true)
    expect(result.data.title).toBe(postData.title)
  })
})
```

## 결론

TypeScript를 사용하면 런타임 오류를 크게 줄이고 개발 생산성을 향상시킬 수 있습니다. 특히 API 개발에서는 타입 안전성이 매우 중요하며, Zod와 같은 검증 라이브러리와 함께 사용하면 더욱 강력한 시스템을 구축할 수 있습니다.',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440003',
    'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    false,
    NOW() - INTERVAL '3 hours',
    12,
    45,
    8,
    'published'
);

-- 포스트-태그 관계 데이터 삽입
INSERT INTO post_tags (post_id, tag_id) VALUES
-- 첫 번째 포스트 태그
('550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440007'), -- React
('550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440008'), -- Next.js
('550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440009'), -- TypeScript
('550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440010'), -- Tailwind CSS
('550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440011'), -- shadcn/ui

-- 두 번째 포스트 태그
('550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440012'), -- PostgreSQL
('550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440013'), -- Neon
('550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440014'), -- 데이터베이스

-- 세 번째 포스트 태그
('550e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440009'), -- TypeScript
('550e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440014'); -- 데이터베이스

-- 댓글 데이터 삽입
INSERT INTO comments (id, content, author_name, author_email, post_id) VALUES
(
    '550e8400-e29b-41d4-a716-446655440018',
    '정말 유용한 글이네요! shadcn/ui를 사용해서 프로젝트를 시작해보겠습니다.',
    '개발자 김철수',
    'kim@example.com',
    '550e8400-e29b-41d4-a716-446655440015'
),
(
    '550e8400-e29b-41d4-a716-446655440019',
    'Neon PostgreSQL 설정이 생각보다 간단하네요. 좋은 정보 감사합니다!',
    '백엔드 개발자',
    'backend@example.com',
    '550e8400-e29b-41d4-a716-446655440016'
),
(
    '550e8400-e29b-41d4-a716-446655440020',
    'TypeScript와 Zod 조합이 정말 강력하네요. 런타임 에러가 확실히 줄어들 것 같습니다.',
    '프론트엔드 개발자',
    'frontend@example.com',
    '550e8400-e29b-41d4-a716-446655440017'
);

COMMIT; 
 
 