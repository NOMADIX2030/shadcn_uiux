'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getAuthUser } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      setIsLoading(false);

      if (!authenticated) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>인증 확인 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>로그인이 필요합니다.</p>
          <p>로그인 페이지로 이동합니다...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// 사용자 정보를 표시하는 컴포넌트
export function UserInfo() {
  const [user, setUser] = useState(getAuthUser());

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  if (!user) return null;

  return (
    <div className="flex items-center space-x-2 text-sm">
      <span className="text-muted-foreground">안녕하세요,</span>
      <span className="font-medium">{user.name}</span>
    </div>
  );
} 