import { ReactNode } from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { Toaster } from '@/components/ui/sonner';

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showToaster?: boolean;
  className?: string;
}

export function MainLayout({ 
  children, 
  showHeader = false, 
  showFooter = false, 
  showToaster = false,
  className = "" 
}: MainLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {showHeader && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
      {showToaster && <Toaster />}
    </div>
  );
} 