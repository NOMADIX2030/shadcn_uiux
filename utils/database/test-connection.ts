import { testConnection } from '@/lib/db/connection';

// 데이터베이스 연결 테스트 함수
export async function testDatabaseConnection() {
  console.log('🔍 데이터베이스 연결 테스트를 시작합니다...');
  
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('✅ 데이터베이스 연결이 성공했습니다!');
      return true;
    } else {
      console.log('❌ 데이터베이스 연결에 실패했습니다.');
      return false;
    }
  } catch (error) {
    console.error('❌ 데이터베이스 연결 테스트 중 오류 발생:', error);
    return false;
  }
}

// 환경변수 검증 함수
export function validateEnvironmentVariables() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ 누락된 환경변수:', missingVars);
    return false;
  }

  console.log('✅ 모든 필수 환경변수가 설정되었습니다.');
  return true;
}

// 전체 데이터베이스 상태 확인
export async function checkDatabaseHealth() {
  console.log('🏥 데이터베이스 상태를 확인합니다...');
  
  // 환경변수 검증
  if (!validateEnvironmentVariables()) {
    return false;
  }
  
  // 연결 테스트
  if (!await testDatabaseConnection()) {
    return false;
  }
  
  console.log('✅ 데이터베이스가 정상 상태입니다.');
  return true;
} 
 
 