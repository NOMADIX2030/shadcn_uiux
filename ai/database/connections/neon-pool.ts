import { Pool, PoolConfig } from 'pg';

/**
 * Neon PostgreSQL 연결 풀 설정
 * Neon 공식 권장사항을 따른 안전한 연결 설정
 */

// 환경변수 검증 (DATABASE_URL만 필수)
if (!process.env.DATABASE_URL) {
  throw new Error('Missing required environment variable: DATABASE_URL');
}

// Neon 권장 연결 설정
const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  
  // SSL 설정 (Neon 필수)
  ssl: {
    rejectUnauthorized: false,
    // 추가 SSL 옵션
    checkServerIdentity: () => undefined,
  },
  
  // 연결 풀 설정 (Neon 권장)
  max: 10, // 최대 연결 수 (무료 티어에 적합)
  min: 2,  // 최소 연결 수
  idleTimeoutMillis: 30000, // 30초
  connectionTimeoutMillis: 10000, // 10초
  
  // 연결 재시도 설정
  allowExitOnIdle: true,
  
  // 쿼리 타임아웃
  statement_timeout: 30000, // 30초
  
  // 애플리케이션 이름 (모니터링용)
  application_name: 'shadcn-blog',
};

// 연결 풀 생성
const pool = new Pool(poolConfig);

// 연결 이벤트 리스너
pool.on('connect', (client) => {
  console.log('🔗 Database connected successfully');
  
  // 연결별 설정 (매개변수 바인딩 없이 직접 설정)
  client.query("SET application_name = 'shadcn-blog'").catch(err => {
    console.warn('Failed to set application_name:', err.message);
  });
});

pool.on('error', (err, client) => {
  console.error('❌ Database connection error:', err);
  
  // 에러 로깅 및 모니터링
  if (process.env.NODE_ENV === 'production') {
    // 프로덕션에서는 에러 추적 서비스로 전송
    console.error('Production database error:', {
      error: err.message,
      stack: err.stack,
    });
  }
});

pool.on('remove', (client) => {
  console.log('🔌 Database connection removed');
});

// 연결 풀 상태 확인
export const getPoolStatus = () => {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
  };
};

// 안전한 연결 종료
export const closePool = async (): Promise<void> => {
  try {
    await pool.end();
    console.log('🔌 Database pool closed successfully');
  } catch (error) {
    console.error('❌ Error closing database pool:', error);
    throw error;
  }
};

export default pool; 
 
 