'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export function useCurrentPath() {
  const pathname = usePathname();
  
  const currentCategory = useMemo(() => {
    const categoryMatch = pathname.match(/\/blog\/categories\/([^\/]+)/);
    return categoryMatch ? categoryMatch[1] : null;
  }, [pathname]);

  const isCategoryPage = useMemo(() => {
    return pathname.startsWith('/blog/categories/');
  }, [pathname]);

  const isBlogPage = useMemo(() => {
    return pathname === '/blog';
  }, [pathname]);

  const isHomePage = useMemo(() => {
    return pathname === '/';
  }, [pathname]);

  const isAboutPage = useMemo(() => {
    return pathname === '/about';
  }, [pathname]);

  const isFeaturesPage = useMemo(() => {
    return pathname === '/features';
  }, [pathname]);

  return {
    pathname,
    currentCategory,
    isCategoryPage,
    isBlogPage,
    isHomePage,
    isAboutPage,
    isFeaturesPage,
  };
} 