import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import pool from '../connections/neon-pool';

/**
 * 데이터베이스 마이그레이션 시스템
 * Neon PostgreSQL에서 안전하게 마이그레이션을 실행
 */

interface MigrationRecord {
  id: number;
  version: string;
  name: string;
  applied_at: Date;
  checksum: string;
}

class DatabaseMigrator {
  private migrationsPath: string;

  constructor() {
    this.migrationsPath = join(process.cwd(), 'ai', 'database', 'migrations');
  }

  /**
   * 마이그레이션 파일 목록 가져오기
   */
  private getMigrationFiles(): string[] {
    try {
      const files = readdirSync(this.migrationsPath)
        .filter(file => file.endsWith('.sql'))
        .sort(); // 파일명 순으로 정렬
      
      return files;
    } catch (error) {
      console.error('❌ 마이그레이션 디렉토리를 읽을 수 없습니다:', error);
      return [];
    }
  }

  /**
   * 적용된 마이그레이션 목록 가져오기
   */
  private async getAppliedMigrations(): Promise<MigrationRecord[]> {
    try {
      const result = await pool.query<MigrationRecord>(
        'SELECT * FROM schema_migrations ORDER BY version'
      );
      return result.rows;
    } catch (error) {
      console.log('📋 schema_migrations 테이블이 없습니다. 초기 마이그레이션을 실행합니다.');
      return [];
    }
  }

  /**
   * 마이그레이션 실행
   */
  async migrate(): Promise<void> {
    console.log('🚀 데이터베이스 마이그레이션을 시작합니다...');

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const migrationFiles = this.getMigrationFiles();
      const appliedMigrations = await this.getAppliedMigrations();
      const appliedVersions = appliedMigrations.map(m => m.version);

      console.log(`📋 총 ${migrationFiles.length}개의 마이그레이션 파일을 발견했습니다.`);
      console.log(`📋 ${appliedMigrations.length}개의 마이그레이션이 이미 적용되었습니다.`);

      let appliedCount = 0;

      for (const file of migrationFiles) {
        const version = file.split('_')[0];
        
        if (appliedVersions.includes(version)) {
          console.log(`⏭️  ${file} - 이미 적용됨`);
          continue;
        }

        console.log(`🔄 ${file} - 적용 중...`);

        try {
          const filePath = join(this.migrationsPath, file);
          const sql = readFileSync(filePath, 'utf-8');

          // 마이그레이션 실행
          await client.query(sql);

          // 마이그레이션 기록
          const checksum = this.generateChecksum(sql);
          await client.query(
            'INSERT INTO schema_migrations (version, name, checksum) VALUES ($1, $2, $3)',
            [version, file.replace('.sql', ''), checksum]
          );

          console.log(`✅ ${file} - 성공적으로 적용됨`);
          appliedCount++;

        } catch (error) {
          console.error(`❌ ${file} - 마이그레이션 실패:`, error);
          await client.query('ROLLBACK');
          throw error;
        }
      }

      await client.query('COMMIT');

      if (appliedCount === 0) {
        console.log('🎉 모든 마이그레이션이 이미 최신 상태입니다.');
      } else {
        console.log(`🎉 ${appliedCount}개의 마이그레이션이 성공적으로 적용되었습니다.`);
      }

    } catch (error) {
      console.error('❌ 마이그레이션 중 오류 발생:', error);
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * 마이그레이션 상태 확인
   */
  async status(): Promise<void> {
    console.log('📊 마이그레이션 상태를 확인합니다...');

    const migrationFiles = this.getMigrationFiles();
    const appliedMigrations = await this.getAppliedMigrations();
    const appliedVersions = appliedMigrations.map(m => m.version);

    console.log('\n📋 마이그레이션 상태:');
    console.log('─'.repeat(60));

    for (const file of migrationFiles) {
      const version = file.split('_')[0];
      const isApplied = appliedVersions.includes(version);
      const status = isApplied ? '✅ 적용됨' : '⏳ 대기중';
      
      console.log(`${status} ${file}`);
    }

    console.log('─'.repeat(60));
    console.log(`총 ${migrationFiles.length}개 파일, ${appliedMigrations.length}개 적용됨`);
  }

  /**
   * 간단한 체크섬 생성
   */
  private generateChecksum(content: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
  }
}

// CLI 실행
if (require.main === module) {
  const migrator = new DatabaseMigrator();
  const command = process.argv[2];

  switch (command) {
    case 'migrate':
      migrator.migrate()
        .then(() => {
          console.log('🎉 마이그레이션이 완료되었습니다.');
          process.exit(0);
        })
        .catch((error) => {
          console.error('❌ 마이그레이션 실패:', error);
          process.exit(1);
        });
      break;

    case 'status':
      migrator.status()
        .then(() => {
          process.exit(0);
        })
        .catch((error) => {
          console.error('❌ 상태 확인 실패:', error);
          process.exit(1);
        });
      break;

    default:
      console.log('사용법:');
      console.log('  npm run migrate    - 마이그레이션 실행');
      console.log('  npm run migrate:status - 마이그레이션 상태 확인');
      process.exit(1);
  }
}

export default DatabaseMigrator; 
 
 