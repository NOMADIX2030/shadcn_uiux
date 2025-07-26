import { ReactNode } from 'react';
import { Separator } from '@/components/ui/separator';

interface BlogLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  sidebar?: ReactNode;
  showSidebar?: boolean;
  className?: string;
}

export function BlogLayout({ 
  children, 
  title,
  description,
  sidebar,
  showSidebar = false,
  className = ""
}: BlogLayoutProps) {
  return (
    <div className={className}>
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 섹션 */}
        {(title || description) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-4xl font-bold mb-4">{title}</h1>
            )}
            {description && (
              <p className="text-lg text-muted-foreground max-w-3xl">
                {description}
              </p>
            )}
            <Separator className="mt-6" />
          </div>
        )}

        {/* 메인 콘텐츠 */}
        <div className={`${showSidebar ? 'grid grid-cols-1 lg:grid-cols-4 gap-8' : ''}`}>
          <div className={showSidebar ? 'lg:col-span-3' : ''}>
            {children}
          </div>
          
          {showSidebar && sidebar && (
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                {sidebar}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
} 