export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  category: Category;
  tags?: string[];
  featuredImage: string;
  featured: boolean;
  views: number;
  likes: number;
}

// API 응답 데이터 구조
export interface ApiBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  featured_image: string;
  featured: boolean;
  published_at: string;
  reading_time: number;
  views: number;
  likes: number;
  status: string;
  author_name: string;
  author_avatar: string;
  category_name: string;
  category_slug: string;
  category_color: string;
  comment_count: string;
  created_at?: string;
  updated_at?: string;
  tags?: Array<{
    name: string;
    slug: string;
    color: string;
  }>;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  postCount: number;
}

export interface BlogListProps {
  posts: BlogPost[];
  category?: Category;
  pagination?: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface BlogCardProps {
  post: BlogPost | ApiBlogPost;
  variant?: 'default' | 'featured' | 'compact';
}

export interface SearchResult {
  posts: BlogPost[];
  total: number;
  query: string;