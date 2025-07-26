import { Pool, PoolClient } from 'pg';

// 데이터베이스 연결 풀 생성
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20, // 최대 연결 수
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// 연결 풀 이벤트 리스너
pool.on('connect', (client: PoolClient) => {
  console.log('🔗 Database connected');
});

pool.on('error', (err: Error, client: PoolClient) => {
  console.error('❌ Database connection error:', err);
});

pool.on('remove', (client: PoolClient) => {
  console.log('🔌 Database connection removed');
});

// 데이터베이스 연결 테스트
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connection test successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
}

// 트랜잭션 실행 함수
export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// 단일 쿼리 실행 함수
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const client = await pool.connect();
  
  try {
    const result = await client.query(text, params);
    return result.rows;
  } finally {
    client.release();
  }
}

// 연결 풀 종료
export async function closePool(): Promise<void> {
  await pool.end();
  console.log('🔌 Database pool closed');
}

export default pool; 
 
 