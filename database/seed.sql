-- 초기 데이터 삽입 스크립트
-- shadcn-ui 블로그 테스트 데이터

-- 사용자 데이터 삽입
INSERT INTO users (email, name, avatar_url, bio) VALUES
('kimdev@example.com', '김개발', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', '프론트엔드 개발자로서 사용자 경험을 중시하는 웹 애플리케이션을 만드는 것을 좋아합니다.'),
('leedesign@example.com', '이디자인', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'UI/UX 디자이너로 사용자 중심의 아름다운 인터페이스를 설계합니다.')
ON CONFLICT (email) DO NOTHING;

-- 카테고리 데이터 삽입
INSERT INTO categories (name, slug, description, color) VALUES
('프론트엔드', 'frontend', 'React, Vue, Angular 등 프론트엔드 기술에 관한 글', 'bg-blue-500'),
('백엔드', 'backend', 'Node.js, Python, Java 등 백엔드 개발 관련 글', 'bg-green-500')
ON CONFLICT (slug) DO NOTHING;

-- 태그 데이터 삽입
INSERT INTO tags (name, slug) VALUES
('React', 'react'),
('Next.js', 'nextjs'),
('TypeScript', 'typescript'),
('Tailwind CSS', 'tailwind-css'),
('shadcn/ui', 'shadcn-ui'),
('Node.js', 'nodejs'),
('PostgreSQL', 'postgresql'),
('웹 개발', 'web-development'),
('UI/UX', 'ui-ux'),
('성능 최적화', 'performance')
ON CONFLICT (slug) DO NOTHING;

-- 포스트 데이터 삽입
INSERT INTO posts (title, slug, excerpt, content, author_id, category_id, featured_image, featured, reading_time, status) 
SELECT 
    'shadcn/ui로 현대적인 블로그 만들기',
    'building-modern-blog-with-shadcn-ui',
    'shadcn/ui 컴포넌트를 활용하여 아름답고 접근성이 뛰어난 블로그를 구축하는 방법을 알아봅니다.',
    '# shadcn/ui로 현대적인 블로그 만들기

shadcn/ui는 Radix UI와 Tailwind CSS를 기반으로 한 재사용 가능한 컴포넌트 라이브러리입니다. 
이 글에서는 shadcn/ui를 활용하여 현대적이고 접근성이 뛰어난 블로그를 구축하는 방법을 단계별로 설명합니다.

## 왜 shadcn/ui인가?

shadcn/ui는 다음과 같은 장점을 제공합니다:

- **접근성**: WCAG 2.1 AA 준수
- **커스터마이징**: 완전한 스타일 커스터마이징 가능
- **성능**: 번들 크기 최적화
- **개발자 경험**: TypeScript 지원과 직관적인 API

## 설치 및 설정

```bash
npx shadcn@latest init
npx shadcn@latest add button card input
```

## 컴포넌트 활용

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function BlogCard({ post }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{post.excerpt}</p>
        <Button>자세히 보기</Button>
      </CardContent>
    </Card>
  )
}
```

## 결론

shadcn/ui를 활용하면 빠르고 효율적으로 현대적인 블로그를 구축할 수 있습니다.',
    u.id,
    c.id,
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
    true,
    8,
    'published'
FROM users u, categories c 
WHERE u.email = 'kimdev@example.com' AND c.slug = 'frontend'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO posts (title, slug, excerpt, content, author_id, category_id, featured_image, featured, reading_time, status)
SELECT 
    'Next.js 15의 새로운 기능들',
    'nextjs-15-new-features',
    'Next.js 15에서 추가된 새로운 기능들과 개선사항을 살펴보고 실제 프로젝트에 적용하는 방법을 알아봅니다.',
    '# Next.js 15의 새로운 기능들

Next.js 15는 성능과 개발자 경험을 크게 향상시킨 주요 업데이트입니다.

## 주요 개선사항

### 1. 향상된 성능
- 더 빠른 빌드 시간
- 개선된 번들 최적화
- 향상된 캐싱 메커니즘

### 2. 개발자 경험 개선
- 더 나은 에러 메시지
- 향상된 TypeScript 지원
- 개선된 디버깅 도구

## 실제 적용 사례

```tsx
// 새로운 App Router 활용
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4">
          {/* 네비게이션 */}
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
```

## 결론

Next.js 15는 더 나은 성능과 개발자 경험을 제공합니다.',
    u.id,
    c.id,
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    false,
    12,
    'published'
FROM users u, categories c 
WHERE u.email = 'kimdev@example.com' AND c.slug = 'frontend'
ON CONFLICT (slug) DO NOTHING;

-- 포스트-태그 관계 데이터 삽입
INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id
FROM posts p, tags t
WHERE p.slug = 'building-modern-blog-with-shadcn-ui' 
AND t.slug IN ('shadcn-ui', 'React', 'TypeScript', 'Tailwind CSS')
ON CONFLICT DO NOTHING;

INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id
FROM posts p, tags t
WHERE p.slug = 'nextjs-15-new-features' 
AND t.slug IN ('Next.js', 'React', '웹 개발', '성능 최적화')
ON CONFLICT DO NOTHING;

-- 댓글 데이터 삽입
INSERT INTO comments (content, author_name, author_email, post_id)
SELECT 
    '정말 유용한 글이네요! shadcn/ui로 프로젝트를 시작해보고 싶습니다.',
    '개발자A',
    'dev.a@example.com',
    p.id
FROM posts p
WHERE p.slug = 'building-modern-blog-with-shadcn-ui'
ON CONFLICT DO NOTHING;

INSERT INTO comments (content, author_name, author_email, post_id)
SELECT 
    'Next.js 15 업데이트가 정말 기대됩니다. 성능 개선이 많이 되었나요?',
    '개발자B',
    'dev.b@example.com',
    p.id
FROM posts p
WHERE p.slug = 'nextjs-15-new-features'
ON CONFLICT DO NOTHING; 
 
 