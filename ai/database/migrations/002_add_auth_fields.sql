-- Migration: 002_add_auth_fields.sql
-- Description: 인증 시스템을 위한 필드 추가
-- Created: 2025-07-26
-- Author: AI Assistant

BEGIN;

-- users 테이블에 인증 관련 필드 추가
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'editor')),
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS login_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE;

-- 기존 사용자들에게 기본 역할 할당
UPDATE users SET role = 'admin' WHERE email = 'admin@shadcn-blog.com';
UPDATE users SET role = 'editor' WHERE email = 'writer@shadcn-blog.com';

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email_verification_token ON users(email_verification_token);
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token);

-- 마이그레이션 기록
INSERT INTO schema_migrations (version, name, checksum)
VALUES ('002', 'add_auth_fields', 'sha256_auth_fields_checksum')
ON CONFLICT (version) DO NOTHING;

COMMIT; 
 
 