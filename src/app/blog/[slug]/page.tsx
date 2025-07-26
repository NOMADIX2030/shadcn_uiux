import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BlogLayout } from '@/components/layout/blog-layout';
import { BlogHero } from '@/components/blog/blog-hero';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Eye, Heart, MessageCircle } from 'lucide-react';
import { getPostBySlug, getAllPosts, type Post } from '@/lib/db/posts';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// 메타데이터 생성 함수
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const post = await getPostBySlug(slug);
    
    if (!post) {
      return {
        title: '포스트를 찾을 수 없습니다',
        description: '요청하신 블로그 포스트를 찾을 수 없습니다.',
      };
    }
    
    return {
      title: `${post.title} | shadcn 블로그`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: [post.featured_image],
        type: 'article',
        publishedTime: post.published_at,
        authors: [post.author_name],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: [post.featured_image],
      },
    };
  } catch (error) {
    return {
      title: '블로그 포스트',
      description: '블로그 포스트를 불러오는 중 오류가 발생했습니다.',
    };
  }
}

// 정적 경로 생성 (SSG)
export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('정적 경로 생성 오류:', error);
    return [];
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  try {
    // URL 디코딩 처리
    const decodedSlug = decodeURIComponent(slug);
    console.log('원본 슬러그:', slug);
    console.log('디코딩된 슬러그:', decodedSlug);
    
    const post = await getPostBySlug(decodedSlug);
    
    if (!post) {
      console.error(`포스트를 찾을 수 없습니다: ${slug}`);
      notFound();
    }
    
    // 포스트 내용 (실제로는 마크다운이나 리치 텍스트 에디터 사용)
    const content = `
# ${post.title}

${post.excerpt}

## 소개

이 포스트에서는 ${post.title}에 대해 자세히 알아보겠습니다. 

## 주요 내용

- 첫 번째 주요 포인트
- 두 번째 주요 포인트  
- 세 번째 주요 포인트

## 결론

이상으로 ${post.title}에 대한 내용을 마치겠습니다. 

더 많은 정보를 원하시면 댓글로 남겨주세요!
    `;
    
    return (
      <BlogLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* 포스트 헤더 */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-sm">
                {post.category_name}
              </Badge>
              {post.featured && (
                <Badge variant="default" className="text-sm">
                  추천
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
            
            {/* 메타 정보 */}
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={post.author_avatar} alt={post.author_name} />
                  <AvatarFallback>{post.author_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{post.author_name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.published_at).toLocaleDateString('ko-KR')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.reading_time}분 읽기</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.views}회 조회</span>
              </div>
            </div>
          </div>
          
          {/* 포스트 이미지 */}
          {post.featured_image && (
            <div className="mb-8">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
          
          {/* 포스트 내용 */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {content}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 포스트 푸터 */}
          <div className="flex items-center justify-between py-6 border-t">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
                <span>{post.likes}</span>
              </button>
              
              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>{post.comment_count}</span>
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              마지막 업데이트: {new Date(post.published_at).toLocaleDateString('ko-KR')}
            </div>
          </div>
          
          <Separator className="my-8" />
          
          {/* 관련 포스트 섹션 (향후 구현) */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">관련 포스트</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">다음 포스트 제목</h3>
                  <p className="text-gray-600 text-sm">다음 포스트에 대한 간단한 설명...</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">이전 포스트 제목</h3>
                  <p className="text-gray-600 text-sm">이전 포스트에 대한 간단한 설명...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </BlogLayout>
    );
  } catch (error) {
    console.error('포스트 로딩 오류:', error);
    notFound();
  }
} 
 
