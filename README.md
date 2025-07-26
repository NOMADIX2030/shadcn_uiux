# 🚀 Modern Blog Platform

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/NOMADIX2030/shadcn_uiux)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17.5-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

현대적인 블로그 플랫폼으로, **Next.js 15.4.4**, **shadcn/ui**, **PostgreSQL**을 활용하여 구축되었습니다. 최신 보안 권장사항을 적용한 안전하고 확장 가능한 시스템을 제공합니다.

> 🌟 **GitHub 저장소**: [https://github.com/NOMADIX2030/shadcn_uiux](https://github.com/NOMADIX2030/shadcn_uiux)

## 🌟 주요 기능

### 🎨 **UI/UX & 디자인**
- ✅ **모던 UI/UX**: shadcn/ui 컴포넌트 기반의 아름다운 인터페이스
- ✅ **반응형 디자인**: 모바일, 태블릿, 데스크톱 완벽 지원
- ✅ **다크모드 지원**: 테마 전환 기능 (구현 준비 완료)
- ✅ **애니메이션**: Tailwind CSS 애니메이션으로 부드러운 인터랙션
- ✅ **접근성**: ARIA 라벨 및 키보드 네비게이션 지원

### 📝 **콘텐츠 관리**
- ✅ **실시간 이미지 URL 처리**: 파일 업로드 대신 URL 입력으로 간편한 이미지 관리
- ✅ **한글 슬러그 자동 변환**: 한글 제목을 영문 슬러그로 자동 변환
- ✅ **추천 글 시스템**: 메인 페이지에 추천 글 표시
- ✅ **카테고리 및 태그**: 체계적인 콘텐츠 분류
- ✅ **읽기 시간 자동 계산**: 콘텐츠 길이에 따른 읽기 시간 자동 계산
- ✅ **미리보기 기능**: 글 작성 중 실시간 미리보기

### 🔐 **보안 & 인증**
- ✅ **JWT 인증 시스템**: 안전한 로그인/로그아웃 기능
- ✅ **관리자 전용 글쓰기**: 인증된 사용자만 글 작성 가능
- ✅ **보안 API**: Next.js 15.4.4 권장 보안 기능
- ✅ **Rate Limiting**: API 남용 방지
- ✅ **입력 검증**: Zod 스키마 기반 검증
- ✅ **CORS 설정**: 안전한 크로스 오리진 요청 처리

### 🗄️ **데이터베이스 & 성능**
- ✅ **Neon PostgreSQL**: 서버리스 PostgreSQL 데이터베이스
- ✅ **연결 풀링**: 효율적인 데이터베이스 연결 관리
- ✅ **마이그레이션 시스템**: 체계적인 스키마 관리
- ✅ **타입 안전성**: TypeScript 완전 지원
- ✅ **SEO 최적화**: 메타데이터 및 구조화된 데이터

### 🛠️ **개발 도구**
- ✅ **환경변수 관리**: 자동화된 설정 도구
- ✅ **API 테스트**: 자동화된 API 테스트 스크립트
- ✅ **데이터베이스 관리**: 원클릭 데이터베이스 설정
- ✅ **Hot Reload**: 개발 중 실시간 코드 반영

## 📁 프로젝트 구조

```
shadcn_uiux/
├── ai/                    # AI 친숙한 구조
│   ├── api/              # API 관련
│   │   ├── middleware/   # 보안 미들웨어
│   │   │   ├── security.ts      # API 보안 미들웨어
│   │   │   └── auth.ts          # JWT 인증 시스템
│   │   └── schemas/      # 검증 스키마
│   │       └── validation.ts    # Zod 검증 스키마
│   ├── database/         # 데이터베이스 관련
│   │   ├── connections/  # 연결 관리
│   │   │   └── neon-pool.ts     # Neon PostgreSQL 연결 풀
│   │   ├── migrations/   # 마이그레이션
│   │   │   ├── migrate.ts       # 마이그레이션 실행 도구
│   │   │   ├── 001_initial_schema.sql
│   │   │   └── 002_add_auth_fields.sql
│   │   └── seeds/        # 초기 데이터
│   │       └── initial_data.sql # 초기 사용자, 카테고리, 포스트
│   ├── scripts/          # 자동화 스크립트
│   │   ├── setup-database.sh    # 데이터베이스 설정
│   │   ├── setup-env.sh         # 환경변수 설정
│   │   ├── test-api.sh          # API 테스트
│   │   └── test-auth.sh         # 인증 테스트
│   └── utils/            # 유틸리티
│       └── database/     # 데이터베이스 유틸리티
│           └── test-connection.ts
├── src/                   # 소스 코드
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API 라우트
│   │   │   ├── posts/    # 포스트 API
│   │   │   │   └── route.ts
│   │   │   ├── categories/ # 카테고리 API
│   │   │   │   └── route.ts
│   │   │   ├── tags/     # 태그 API
│   │   │   │   └── route.ts
│   │   │   ├── auth/     # 인증 API
│   │   │   │   ├── login/route.ts
│   │   │   │   └── register/route.ts
│   │   │   ├── users/    # 사용자 API
│   │   │   └── comments/ # 댓글 API
│   │   ├── blog/         # 블로그 페이지
│   │   │   ├── page.tsx  # 블로그 목록
│   │   │   ├── [slug]/   # 개별 포스트
│   │   │   ├── new/      # 글쓰기 페이지
│   │   │   └── categories/[slug]/ # 카테고리별 목록
│   │   ├── login/        # 로그인 페이지
│   │   ├── about/        # 소개 페이지
│   │   ├── features/     # 기능 페이지
│   │   ├── page.tsx      # 메인 페이지
│   │   ├── layout.tsx    # 루트 레이아웃
│   │   └── globals.css   # 전역 스타일
│   ├── components/       # React 컴포넌트
│   │   ├── ui/           # shadcn/ui 컴포넌트
│   │   ├── blog/         # 블로그 관련 컴포넌트
│   │   ├── layout/       # 레이아웃 컴포넌트
│   │   ├── auth/         # 인증 컴포넌트
│   │   ├── common/       # 공통 컴포넌트
│   │   └── seo/          # SEO 컴포넌트
│   ├── lib/              # 유틸리티
│   │   ├── auth.ts       # 인증 유틸리티
│   │   ├── utils.ts      # 일반 유틸리티
│   │   └── db/           # 데이터베이스 유틸리티
│   │       ├── posts.ts  # 포스트 관련 쿼리
│   │       └── categories.ts # 카테고리 관련 쿼리
│   ├── hooks/            # 커스텀 훅
│   │   └── use-current-path.ts
│   └── types/            # TypeScript 타입 정의
│       └── blog.ts       # 블로그 관련 타입
├── public/               # 정적 파일
│   ├── images/           # 이미지 파일
│   └── favicon.ico       # 파비콘
├── package.json          # 프로젝트 설정
├── tailwind.config.ts    # Tailwind CSS 설정
├── tsconfig.json         # TypeScript 설정
├── next.config.ts        # Next.js 설정
└── README.md             # 프로젝트 문서
```

## 🛠️ 설치 및 설정

### 1. 저장소 클론
```bash
# GitHub에서 프로젝트 클론
git clone https://github.com/NOMADIX2030/shadcn_uiux.git
cd shadcn_uiux

# 또는 SSH를 사용하는 경우
git clone git@github.com:NOMADIX2030/shadcn_uiux.git
cd shadcn_uiux
```

### 2. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
```bash
# 자동 환경변수 설정 (권장)
npm run env:setup

# 또는 수동 설정
# .env.local 파일 생성
cp .env.example .env.local

# 필수 환경변수 설정
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_IN="30d"

# 선택적 환경변수
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
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
- `GET` - 포스트 목록 (페이지네이션, 검색, 필터링, 정렬)
  - 쿼리 파라미터: `page`, `limit`, `search`, `sort`, `sortBy`
  - 응답: 포스트 목록, 페이지네이션 정보
- `POST` - 새 포스트 생성 (인증 필요)
  - 요청 본문: 제목, 슬러그, 요약, 내용, 카테고리, 태그, 이미지 URL 등
  - 응답: 생성된 포스트 정보
- `OPTIONS` - CORS preflight

#### **카테고리 API** (`/api/categories`)
- `GET` - 카테고리 목록 (포스트 수 포함)
  - 응답: 카테고리 목록, 각 카테고리별 포스트 수
- `POST` - 새 카테고리 생성 (인증 필요)
- `OPTIONS` - CORS preflight

#### **태그 API** (`/api/tags`)
- `GET` - 태그 목록 (알파벳 순 정렬)
- `POST` - 새 태그 생성 (중복 방지)
- `OPTIONS` - CORS preflight

#### **인증 API** (`/api/auth/login`)
- `POST` - 사용자 로그인
  - 요청 본문: `email`, `password`
  - 응답: 사용자 정보, JWT 토큰
- `OPTIONS` - CORS preflight

#### **회원가입 API** (`/api/auth/register`)
- `POST` - 사용자 회원가입
  - 요청 본문: `email`, `password`, `name`, `confirmPassword`
  - 응답: 생성된 사용자 정보
- `OPTIONS` - CORS preflight

#### **사용자 API** (`/api/users`)
- `GET` - 사용자 목록 (관리자 전용)
- `GET /[id]` - 개별 사용자 정보
- `PUT /[id]` - 사용자 정보 수정
- `DELETE /[id]` - 사용자 삭제 (소프트 삭제)

#### **댓글 API** (`/api/comments`)
- `GET` - 댓글 목록 (포스트별)
- `POST` - 새 댓글 작성
- `PUT /[id]` - 댓글 수정
- `DELETE /[id]` - 댓글 삭제

## 🗄️ 데이터베이스

### Neon PostgreSQL 설정
- **서비스**: Neon (서버리스 PostgreSQL)
- **버전**: PostgreSQL 17.5
- **연결**: SSL 필수, 연결 풀링 지원
- **지역**: 한국 최적화 (Tokyo 또는 Singapore)
- **무료 티어**: 월 10GB 저장공간, 1GB RAM

### 데이터베이스 스키마
- **users**: 사용자 정보 (이메일, 비밀번호 해시, 역할, 아바타)
- **categories**: 카테고리 (이름, 슬러그, 설명, 색상, 포스트 수)
- **posts**: 블로그 포스트 (제목, 슬러그, 내용, 이미지, 추천 여부, 상태)
- **tags**: 태그 (이름, 슬러그)
- **comments**: 댓글 (포스트 ID, 사용자 ID, 내용, 상태)
- **post_tags**: 포스트-태그 관계 (다대다 관계)
- **schema_migrations**: 마이그레이션 추적 (버전 관리)

### 현재 데이터 현황
- **총 포스트**: 5개 (발행됨)
- **카테고리**: Frontend, Backend
- **사용자**: 관리자 계정 1개
- **태그**: 개발 관련 태그들

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

### **프레임워크 & 런타임**
- **Next.js 15.4.4**: React 프레임워크 (App Router)
- **React 19.1.0**: 최신 React 버전
- **TypeScript 5**: 타입 안전성

### **UI & 스타일링**
- **shadcn/ui**: 모던 UI 컴포넌트 라이브러리
- **Tailwind CSS 3.4.6**: 유틸리티 퍼스트 CSS 프레임워크
- **Radix UI**: 접근성 기반 UI 프리미티브
- **Lucide React**: 아이콘 라이브러리
- **Tailwind CSS Animate**: 애니메이션 라이브러리

### **데이터베이스 & 백엔드**
- **PostgreSQL**: 관계형 데이터베이스
- **pg 8.16.3**: PostgreSQL 클라이언트
- **Neon**: 서버리스 PostgreSQL 서비스

### **인증 & 보안**
- **JWT 9.0.2**: JSON Web Token
- **bcryptjs 3.0.2**: 비밀번호 해싱
- **Zod 4.0.10**: 스키마 검증

### **폼 & 상태 관리**
- **React Hook Form 7.61.1**: 폼 관리
- **@hookform/resolvers 5.2.0**: 폼 검증 리졸버

### **개발 도구**
- **tsx 4.20.3**: TypeScript 실행 도구
- **ESLint**: 코드 품질 관리
- **PostCSS**: CSS 후처리기
- **Autoprefixer**: CSS 벤더 프리픽스 자동화

## 🚀 배포

### Vercel 배포 (권장)
```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 배포
vercel login
vercel --prod
```

### Railway 배포
```bash
# Railway CLI 설치
npm install -g railway

# 프로젝트 연결 및 배포
railway login
railway init
railway up
```

### Netlify 배포
```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 프로젝트 배포
netlify login
netlify deploy --prod
```

### 환경변수 설정 (배포 시)
- **Vercel**: 대시보드 → Settings → Environment Variables
- **Railway**: 대시보드 → Variables
- **Netlify**: 대시보드 → Site settings → Environment variables

#### 필수 환경변수
```bash
DATABASE_URL="postgresql://..."
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_IN="30d"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## 🔒 보안

### **환경변수 보안**
- **환경변수**: `.env.local` 파일 사용 (Git 제외)
- **JWT 시크릿**: 최소 32자 이상의 강력한 시크릿 키 사용
- **데이터베이스 URL**: 프로덕션에서는 읽기 전용 사용자 권한 사용

### **데이터베이스 보안**
- **SSL 연결**: 모든 데이터베이스 연결에 SSL 필수
- **연결 풀링**: 효율적인 연결 관리로 리소스 절약
- **백업**: 정기적인 데이터베이스 백업 권장

### **API 보안**
- **Rate Limiting**: API 남용 방지 (IP별 요청 제한)
- **입력 검증**: Zod 스키마 기반 타입 안전성
- **CORS 설정**: 허용된 도메인에서만 API 접근
- **보안 헤더**: XSS, CSRF, Clickjacking 방지

### **인증 보안**
- **비밀번호 해싱**: bcrypt를 사용한 안전한 비밀번호 저장
- **JWT 토큰**: 만료 시간 설정 및 리프레시 토큰 지원
- **토큰 블랙리스트**: 로그아웃 시 토큰 무효화
- **세션 관리**: 클라이언트 사이드 토큰 저장

### **프로덕션 보안 체크리스트**
- [ ] 강력한 JWT_SECRET 설정
- [ ] HTTPS 강제 적용
- [ ] 환경변수 검증 완료
- [ ] 데이터베이스 백업 설정
- [ ] 모니터링 도구 설정
- [ ] 에러 로깅 설정

## 📝 라이선스

MIT License

## 🤝 기여

### **기여 방법**

1. **Fork the repository**
   ```bash
   # GitHub에서 저장소를 포크하세요
   # https://github.com/NOMADIX2030/shadcn_uiux
   ```

2. **Create your feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```

4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**
   - GitHub에서 Pull Request를 생성하세요
   - 변경사항에 대한 상세한 설명을 포함하세요

### **개발 가이드라인**

- **코드 스타일**: TypeScript, ESLint 규칙 준수
- **커밋 메시지**: 명확하고 설명적인 메시지 작성
- **테스트**: 새로운 기능에 대한 테스트 코드 작성
- **문서화**: 코드 변경사항에 대한 문서 업데이트

### **이슈 리포트**

버그를 발견하거나 기능 요청이 있으시면:
1. [GitHub Issues](https://github.com/NOMADIX2030/shadcn_uiux/issues)에서 이슈를 생성하세요
2. 이슈 템플릿을 사용하여 필요한 정보를 제공하세요
3. 재현 가능한 예시와 함께 상세한 설명을 포함하세요

## 📞 지원

### **GitHub 지원 채널**

- **이슈 리포트**: [GitHub Issues](https://github.com/NOMADIX2030/shadcn_uiux/issues)
- **토론**: [GitHub Discussions](https://github.com/NOMADIX2030/shadcn_uiux/discussions)
- **위키**: [GitHub Wiki](https://github.com/NOMADIX2030/shadcn_uiux/wiki)

### **지원 방법**

1. **버그 리포트**: [이슈 생성](https://github.com/NOMADIX2030/shadcn_uiux/issues/new?template=bug_report.md)
2. **기능 요청**: [이슈 생성](https://github.com/NOMADIX2030/shadcn_uiux/issues/new?template=feature_request.md)
3. **질문**: [토론 생성](https://github.com/NOMADIX2030/shadcn_uiux/discussions/new)

### **커뮤니티**

- **GitHub 저장소**: [https://github.com/NOMADIX2030/shadcn_uiux](https://github.com/NOMADIX2030/shadcn_uiux)
- **라이선스**: [MIT License](https://github.com/NOMADIX2030/shadcn_uiux/blob/main/LICENSE)
- **개발자**: NOMADIX2030

## 🎯 로드맵

### **단기 목표 (1-2개월)**
- [ ] 댓글 시스템 구현
- [ ] 사용자 프로필 페이지
- [ ] 이미지 업로드 기능 (Cloudinary 연동)
- [ ] 검색 기능 개선 (전문 검색)
- [ ] 다크모드 완전 구현

### **중기 목표 (3-6개월)**
- [ ] 관리자 대시보드
- [ ] 이메일 알림 시스템
- [ ] 소셜 로그인 (Google, GitHub)
- [ ] 포스트 시리즈 기능
- [ ] 성능 최적화 (캐싱, CDN)

### **장기 목표 (6개월+)**
- [ ] 마이크로프론트엔드 아키텍처
- [ ] 실시간 채팅 기능
- [ ] AI 기반 콘텐츠 추천
- [ ] 다국어 지원
- [ ] 모바일 앱 개발

## 📊 프로젝트 통계

### **GitHub 정보**
- **저장소**: [NOMADIX2030/shadcn_uiux](https://github.com/NOMADIX2030/shadcn_uiux)
- **총 커밋**: 3개
- **브랜치**: main
- **최근 업데이트**: 2025년 7월 26일
- **라이선스**: MIT
- **스타**: 0개
- **포크**: 0개

### **기술 스택**
- **Next.js 버전**: 15.4.4
- **React 버전**: 19.1.0
- **TypeScript**: 5.x
- **데이터베이스**: Neon PostgreSQL
- **UI 라이브러리**: shadcn/ui
- **스타일링**: Tailwind CSS

### **프로젝트 상태**
- **개발 상태**: 활성 개발 중
- **배포 준비**: 완료
- **문서화**: 완료
- **테스트**: 기본 테스트 완료