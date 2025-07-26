import pool from '../../../ai/database/connections/neon-pool';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
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
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const client = await pool.connect();
    
    const sql = `
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
      GROUP BY p.id, u.name, u.avatar_url, c.name, c.slug, c.color
      ORDER BY p.published_at DESC
    `;
    
    const result = await client.query(sql);
    client.release();
    
    return result.rows;
  } catch (error) {
    console.error('포스트 조회 오류:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const client = await pool.connect();
    
    const sql = `
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
      WHERE p.slug = $1 AND p.status = 'published'
      GROUP BY p.id, u.name, u.avatar_url, c.name, c.slug, c.color
    `;
    
    const result = await client.query(sql, [slug]);
    client.release();
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('포스트 조회 오류:', error);
    return null;
  }
}

export async function getFeaturedPosts(): Promise<Post[]> {
  try {
    const client = await pool.connect();
    
    const sql = `
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
      WHERE p.status = 'published' AND p.featured = true
      GROUP BY p.id, u.name, u.avatar_url, c.name, c.slug, c.color
      ORDER BY p.published_at DESC
      LIMIT 6
    `;
    
    const result = await client.query(sql);
    client.release();
    
    return result.rows;
  } catch (error) {
    console.error('피처드 포스트 조회 오류:', error);
    return [];
  }
} 
 
 