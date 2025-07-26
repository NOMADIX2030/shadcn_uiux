# 🚀 Modern Blog Platform

현대적인 블로그 플랫폼으로, **Next.js 15.4.4**, **shadcn/ui**, **PostgreSQL**을 활용하여 구축되었습니다. 최신 보안 권장사항을 적용한 안전하고 확장 가능한 시스템을 제공합니다.

## 🌟 주요 기능

- ✅ **모던 UI/UX**: shadcn/ui 컴포넌트 기반의 아름다운 인터페이스
- ✅ **실시간 이미지 URL 처리**: 파일 업로드 대신 URL 입력으로 간편한 이미지 관리
- ✅ **JWT 인증 시스템**: 안전한 로그인/로그아웃 기능
- ✅ **관리자 전용 글쓰기**: 인증된 사용자만 글 작성 가능
- ✅ **반응형 디자인**: 모바일, 태블릿, 데스크톱 완벽 지원
- ✅ **SEO 최적화**: 메타데이터 및 구조화된 데이터
- ✅ **카테고리 및 태그**: 체계적인 콘텐츠 분류
- ✅ **추천 글 시스템**: 메인 페이지에 추천 글 표시
- ✅ **한글 슬러그 자동 변환**: 한글 제목을 영문 슬러그로 자동 변환

## 🚀 주요 기능

- **모던 UI**: shadcn/ui 컴포넌트 기반
- **데이터베이스**: Neon PostgreSQL (서버리스)
- **타입 안전성**: TypeScript 완전 지원
- **반응형 디자인**: 모바일 우선 설계
- **SEO 최적화**: 메타데이터 및 구조화된 데이터
- **보안 API**: Next.js 15.4.4 권장 보안 기능
- **JWT 인증**: 안전한 토큰 기반 인증 시스템
- **Rate Limiting**: API 남용 방지
- **입력 검증**: Zod 스키마 기반 검증
- **환경변수 관리**: 자동화된 설정 도구

## 📁 프로젝트 구조

```
shadcn_uiux/
├── ai/                    # AI 친숙한 구조
│   ├── api/              # API 관련
│   │   ├── middleware/   # 보안 미들웨어
│   │   │   └── security.ts
│   │   └── schemas/      # 검증 스키마
│   │       └── validation.ts
│   ├── database/         # 데이터베이스 관련
│   │   ├── connections/  # 연결 관리
│   │   │   └── neon-pool.ts
│   │   ├── migrations/   # 마이그레이션
│   │   │   ├── migrate.ts
│   │   │   └── 001_initial_schema.sql
│   │   └── seeds/        # 초기 데이터
│   │       └── initial_data.sql
│   └── scripts/          # 자동화 스크립트
│       ├── setup-database.sh
│       └── test-api.sh
├── src/                   # 소스 코드
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API 라우트
│   │   │   ├── posts/    # 포스트 API
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── categories/ # 카테고리 API
│   │   │       └── route.ts
│   │   ├── blog/         # 블로그 페이지
│   │   ├── about/        # 소개 페이지
│   │   └── features/     # 기능 페이지
│   ├── components/       # React 컴포넌트
│   ├── data/             # 정적 데이터
│   ├── hooks/            # 커스텀 훅
│   ├── lib/              # 유틸리티
│   └── types/            # 타입 정의
└── public/               # 정적 파일
```

## 🛠️ 설치 및 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
```bash
# .env.local 파일 생성
cp .env.example .env.local

# 데이터베이스 정보 입력
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
DB_HOST="your-neon-host"
DB_PORT="5432"
DB_NAME="your-database"
DB_USER="your-username"
DB_PASSWORD="your-password"
```

### 3. 환경변수 검증
```bash
npm run env:validate
```

### 4. 데이터베이스 설정
```bash
# 자동 데이터베이스 설정 (권장)
npm run db:setup

# 또는 수동 설정
npm run migrate
npm run migrate:status
```

### 5. 개발 서버 실행
```bash
npm run dev
```

### 6. API 테스트
```bash
npm run api:test
```

### 7. 인증 테스트
```bash
npm run auth:test
```

## 🔒 보안 API 시스템

### 구현된 보안 기능

#### **보안 미들웨어** (`ai/api/middleware/security.ts`)
- ✅ **CORS 설정** - 크로스 오리진 요청 제어
- ✅ **보안 헤더** - XSS, CSRF, Clickjacking 방지
- ✅ **요청 검증** - Content-Type, User-Agent, 크기 제한
- ✅ **Rate Limiting** - API 남용 방지
- ✅ **입력 검증** - Zod 스키마 기반 타입 안전성
- ✅ **에러 핸들링** - 표준화된 에러 응답

#### **JWT 인증 시스템** (`ai/api/middleware/auth.ts`)
- ✅ **토큰 생성/검증** - 안전한 JWT 토큰 관리
- ✅ **비밀번호 해싱** - bcrypt를 사용한 안전한 비밀번호 저장
- ✅ **역할 기반 권한** - admin, user, editor 역할 지원
- ✅ **토큰 블랙리스트** - 로그아웃 시 토큰 무효화
- ✅ **리프레시 토큰** - 장기간 인증 지원
- ✅ **환경변수 관리** - JWT_SECRET 환경변수 필수 설정

#### **보안 헤더 설정**
```typescript
'X-Content-Type-Options': 'nosniff'
'X-Frame-Options': 'DENY'
'X-XSS-Protection': '1; mode=block'
'Referrer-Policy': 'strict-origin-when-cross-origin'
'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
```

### API 엔드포인트

#### **포스트 API** (`/api/posts`)
- `GET` - 포스트 목록 (페이지네이션, 검색, 필터링)
- `POST` - 새 포스트 생성
- `OPTIONS` - CORS preflight

#### **개별 포스트 API** (`/api/posts/[id]`)
- `GET` - 개별 포스트 조회 (조회수 증가)
- `PUT` - 포스트 수정
- `DELETE` - 포스트 삭제 (소프트 삭제)
- `OPTIONS` - CORS preflight

#### **카테고리 API** (`/api/categories`)
- `GET` - 카테고리 목록 (포스트 수 포함)
- `POST` - 새 카테고리 생성
- `OPTIONS` - CORS preflight

#### **인증 API** (`/api/auth`)
- `POST` - 사용자 로그인
- `OPTIONS` - CORS preflight

#### **회원가입 API** (`/api/auth/register`)
- `POST` - 사용자 회원가입
- `OPTIONS` - CORS preflight

## 🗄️ 데이터베이스

### Neon PostgreSQL 설정
- **서비스**: Neon (서버리스 PostgreSQL)
- **버전**: PostgreSQL 17.5
- **연결**: SSL 필수, 연결 풀링 지원

### 데이터베이스 스키마
- **users**: 사용자 정보
- **categories**: 카테고리 (트리거로 포스트 수 자동 업데이트)
- **posts**: 블로그 포스트 (소프트 삭제 지원)
- **tags**: 태그
- **comments**: 댓글
- **post_tags**: 포스트-태그 관계
- **schema_migrations**: 마이그레이션 추적

### 마이그레이션 시스템
```bash
# 마이그레이션 실행
npm run migrate

# 마이그레이션 상태 확인
npm run migrate:status

# 데이터베이스 연결 테스트
npm run db:test
```

## 🔧 개발 도구

### 환경변수 관리
```bash
# 환경변수 설정
npm run env:setup

# 환경변수 검증
npm run env:validate
```

### API 테스트
```bash
# 전체 API 테스트
npm run api:test

# 인증 API 테스트
npm run auth:test

# 개별 API 테스트
curl http://localhost:3000/api/posts
curl http://localhost:3000/api/categories
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User","confirmPassword":"password123"}'
```

### 데이터베이스 관리
```bash
# 데이터베이스 설정 (전체 과정)
./ai/scripts/setup-database.sh

# 연결 테스트
npx tsx ai/utils/database/test-connection.ts
```

## 📦 주요 패키지

- **Next.js 15.4.4**: React 프레임워크
- **shadcn/ui**: UI 컴포넌트 라이브러리
- **Tailwind CSS**: CSS 프레임워크
- **PostgreSQL**: 데이터베이스
- **TypeScript**: 타입 안전성
- **Zod**: 스키마 검증
- **pg**: PostgreSQL 클라이언트
- **tsx**: TypeScript 실행 도구

## 🚀 배포

### Railway 배포 (권장)
```bash
# Railway CLI 설치
npm install -g railway

# 프로젝트 연결 및 배포
railway login
railway init
railway up
```

### 환경변수 설정 (배포 시)
- Railway 대시보드에서 환경변수 설정
- `DATABASE_URL` 및 기타 필수 환경변수 추가

## 🔒 보안

- **환경변수**: `.env.local` 파일 사용 (Git 제외)
- **데이터베이스**: SSL 연결 필수
- **API 보안**: Rate Limiting, 입력 검증, CORS 설정
- **비밀번호**: 프로덕션에서는 강력한 비밀번호 사용

## 📝 라이선스

MIT License

## 🤝 기여

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해 주세요.