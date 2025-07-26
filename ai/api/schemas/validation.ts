import { z } from 'zod';

/**
 * Next.js 15.4.4 API 검증 스키마
 * Zod를 사용한 타입 안전한 입력 검증
 */

// 기본 페이지네이션 스키마
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.enum(['asc', 'desc']).default('desc'),
  sortBy: z.string().optional(),
});

// 사용자 관련 스키마
export const createUserSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  name: z.string().min(2, '이름은 2자 이상이어야 합니다').max(100),
  avatar_url: z.string().url().optional(),
  bio: z.string().max(500).optional(),
});

export const updateUserSchema = createUserSchema.partial();

// 카테고리 관련 스키마
export const createCategorySchema = z.object({
  name: z.string().min(2, '카테고리명은 2자 이상이어야 합니다').max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, '슬러그는 소문자, 숫자, 하이픈만 사용 가능합니다'),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^bg-[a-z]+-[0-9]+$/, '올바른 Tailwind 색상 클래스를 입력하세요').default('bg-blue-500'),
});

export const updateCategorySchema = createCategorySchema.partial();

// 포스트 관련 스키마
export const createPostSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(255, '제목은 255자 이하여야 합니다'),
  slug: z.string().min(1, '슬러그를 입력해주세요').max(255, '슬러그는 255자 이하여야 합니다'),
  excerpt: z.string().min(1, '요약을 입력해주세요').max(500, '요약은 500자 이하여야 합니다'),
  content: z.string().min(1, '본문을 입력해주세요'),
  author_id: z.string().uuid('유효한 사용자 ID를 입력하세요'),
  category_id: z.string().uuid('카테고리를 선택해주세요'),
  featured_image: z.string().min(1, '대표 이미지를 업로드해주세요'),
  featured: z.boolean(),
  status: z.enum(['draft', 'published']),
  tags: z.array(z.string()).optional(),
  reading_time: z.number().min(1).max(120).optional(),
  published_at: z.string().optional(),
});

export const updatePostSchema = createPostSchema.partial();

// 태그 관련 스키마
export const createTagSchema = z.object({
  name: z.string().min(2, '태그명은 2자 이상이어야 합니다').max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, '슬러그는 소문자, 숫자, 하이픈만 사용 가능합니다'),
});

export const updateTagSchema = createTagSchema.partial();

// 댓글 관련 스키마
export const createCommentSchema = z.object({
  content: z.string().min(1, '댓글 내용을 입력하세요').max(1000, '댓글은 1000자 이하여야 합니다'),
  author_name: z.string().min(2, '작성자명은 2자 이상이어야 합니다').max(100),
  author_email: z.string().email('유효한 이메일을 입력하세요'),
  post_id: z.string().uuid('유효한 포스트 ID를 입력하세요'),
  parent_id: z.string().uuid().optional(),
});

export const updateCommentSchema = createCommentSchema.partial();

// 검색 스키마
export const searchSchema = z.object({
  q: z.string().min(1, '검색어를 입력하세요').max(100),
  type: z.enum(['posts', 'categories', 'tags', 'users']).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
});

// 인증 관련 스키마
export const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
});

export const registerSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '비밀번호는 대소문자와 숫자를 포함해야 합니다'),
  name: z.string().min(2, '이름은 2자 이상이어야 합니다').max(100),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});

// 파일 업로드 스키마
export const fileUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5MB
    '파일 크기는 5MB 이하여야 합니다'
  ).refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    '지원되는 이미지 형식: JPEG, PNG, WebP'
  ),
});

// API 응답 타입
export type PaginationParams = z.infer<typeof paginationSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type SearchParams = z.infer<typeof searchSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>; 
 
 