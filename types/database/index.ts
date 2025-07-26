// 데이터베이스 테이블 타입 정의

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  post_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author_id: string;
  category_id?: string;
  featured_image?: string;
  featured: boolean;
  published_at: Date;
  updated_at: Date;
  reading_time: number;
  views: number;
  likes: number;
  status: 'draft' | 'published' | 'archived';
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: Date;
}

export interface PostTag {
  post_id: string;
  tag_id: string;
}

export interface Comment {
  id: string;
  content: string;
  author_name: string;
  author_email: string;
  post_id: string;
  parent_id?: string;
  created_at: Date;
  updated_at: Date;
}

// 관계형 데이터 타입
export interface PostWithRelations extends Post {
  author: User;
  category?: Category;
  tags: Tag[];
  comments: Comment[];
}

export interface CategoryWithPosts extends Category {
  posts: Post[];
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 페이지네이션 타입
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
} 
 
 