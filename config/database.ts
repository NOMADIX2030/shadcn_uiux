import { z } from 'zod';

// 환경변수 스키마 정의
const databaseSchema = z.object({
  DATABASE_URL: z.string().url(),
  DB_HOST: z.string(),
  DB_PORT: z.string().transform(Number),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// 환경변수 검증 및 타입 안전성 보장
export const databaseConfig = databaseSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  NODE_ENV: process.env.NODE_ENV,
});

// 데이터베이스 연결 옵션
export const dbOptions = {
  host: databaseConfig.DB_HOST,
  port: databaseConfig.DB_PORT,
  database: databaseConfig.DB_NAME,
  user: databaseConfig.DB_USER,
  password: databaseConfig.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20, // 최대 연결 수
}; 
 