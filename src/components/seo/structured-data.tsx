import { BlogPost } from '@/types/blog';

interface StructuredDataProps {
  type: 'blog' | 'article' | 'breadcrumb';
  data: BlogPost | Array<{ name: string; url: string }> | Record<string, unknown>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'blog':
        return {
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Modern Blog",
          "description": "shadcn/ui와 Next.js로 구축된 현대적이고 아름다운 블로그입니다.",
          "url": "https://modern-blog.com",
          "publisher": {
            "@type": "Organization",
            "name": "Modern Blog Team",
            "logo": {
              "@type": "ImageObject",
              "url": "https://modern-blog.com/logo.png"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://modern-blog.com"
          }
        };
      
      case 'article':
        const post = data as BlogPost;
        return {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "image": post.featuredImage,
          "author": {
            "@type": "Person",
            "name": post.author.name,
            "url": post.author.social?.twitter || post.author.social?.github
          },
          "publisher": {
            "@type": "Organization",
            "name": "Modern Blog",
            "logo": {
              "@type": "ImageObject",
              "url": "https://modern-blog.com/logo.png"
            }
          },
          "datePublished": post.publishedAt,
          "dateModified": post.updatedAt,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://modern-blog.com/blog/${post.slug}`
          },
          "wordCount": post.content.length,
          "timeRequired": `PT${post.readingTime}M`,
          "articleSection": post.category.name,
          "keywords": post.tags.join(', ')
        };
      
      case 'breadcrumb':
        const breadcrumbs = data as Array<{ name: string; url: string }>;
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbs.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        };
      
      default:
        return {};
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData())
      }}
    />
  );
} 