import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  container?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function PageLayout({ 
  children, 
  title,
  description,
  className = "",
  container = true,
  maxWidth = 'xl'
}: PageLayoutProps) {
  const containerClasses = container 
    ? `container mx-auto px-4 max-w-${maxWidth === 'full' ? 'none' : maxWidth}`
    : '';

  return (
    <div className={className}>
      <div className={containerClasses}>
        {(title || description) && (
          <div className="py-8 text-center">
            {title && (
              <h1 className="text-4xl font-bold mb-4">{title}</h1>
            )}
            {description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
} 