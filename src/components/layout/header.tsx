'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Menu, Search, Moon, Sun, LogIn, LogOut, User } from 'lucide-react';
import { isAuthenticated, getAuthUser, logout } from '@/lib/auth';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.success && data.data.categories) {
          setCategories(data.data.categories);
        }
      } catch (error) {
        console.error('카테고리 로딩 오류:', error);
      }
    };

    fetchCategories();
  }, []);

  // 인증 상태 확인
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const user = getAuthUser();
      setIsLoggedIn(authenticated);
      setCurrentUser(user);
    };

    checkAuth();
    
    // 주기적으로 인증 상태 확인 (localStorage 변경 감지용)
    const interval = setInterval(checkAuth, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // 실제 다크모드 토글 로직은 여기에 구현
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline-block">Blog</span>
            </Link>
            <Badge variant="secondary" className="hidden md:inline-flex">
              Beta
            </Badge>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>카테고리</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/blog/categories/${category.slug}`}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${category.color}`} />
                            <div className="text-sm font-medium leading-none">{category.name}</div>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {category.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/about" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    소개
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/features" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    기능
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* 우측 액션 버튼들 */}
          <div className="flex items-center space-x-2">
            {/* 검색 버튼 */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-4 w-4" />
              <span className="sr-only">검색</span>
            </Button>

            {/* 다크모드 토글 */}
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">다크모드 토글</span>
            </Button>

            {/* 로그인/로그아웃 버튼 */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{currentUser?.name}</span>
                </div>
                <Button variant="outline" onClick={handleLogout} className="hidden sm:inline-flex">
                  <LogOut className="h-4 w-4 mr-2" />
                  로그아웃
                </Button>
              </div>
            ) : (
              <Button asChild className="hidden sm:inline-flex">
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  로그인
                </Link>
              </Button>
            )}

            {/* 모바일 메뉴 */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">메뉴 열기</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">카테고리</h3>
                    <div className="space-y-1">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/blog/categories/${category.slug}`}
                          className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors"
                        >
                          <div className={`w-3 h-3 rounded-full ${category.color}`} />
                          <span>{category.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Link href="/about" className="block p-2 rounded-md hover:bg-accent transition-colors">
                      소개
                    </Link>
                    <Link href="/features" className="block p-2 rounded-md hover:bg-accent transition-colors">
                      기능
                    </Link>
                  </div>
                  <Separator />
                  {isLoggedIn ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 p-2 text-sm">
                        <User className="h-4 w-4" />
                        <span>{currentUser?.name}</span>
                      </div>
                      <Button onClick={handleLogout} className="w-full" variant="outline">
                        <LogOut className="h-4 w-4 mr-2" />
                        로그아웃
                      </Button>
                    </div>
                  ) : (
                    <Button asChild className="w-full">
                      <Link href="/login">
                        <LogIn className="h-4 w-4 mr-2" />
                        로그인
                      </Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}