import pool from '../../../ai/database/connections/neon-pool';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  post_count: number;
  actual_post_count: string;
  created_at: string;
  updated_at: string;
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const client = await pool.connect();
    
    const sql = `
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.description,
        c.color,
        c.post_count,
        COUNT(p.id) as actual_post_count,
        c.created_at,
        c.updated_at
      FROM categories c
      LEFT JOIN posts p ON c.id = p.category_id AND p.status = 'published'
      GROUP BY c.id, c.name, c.slug, c.description, c.color, c.post_count, c.created_at, c.updated_at
      ORDER BY c.name
    `;
    
    const result = await client.query(sql);
    client.release();
    
    return result.rows;
  } catch (error) {
    console.error('카테고리 조회 오류:', error);
    return [];
  }
} 
 
 