import { BlogHero } from '@/components/blog/blog-hero';
import { BlogCard } from '@/components/blog/blog-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { ArrowRight, TrendingUp, Users, BookOpen, Star } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAllPosts, getFeaturedPosts } from '@/lib/db/posts';
import { getAllCategories } from '@/lib/db/categories';

// 데이터베이스에서 직접 데이터 가져오기
async function getPosts() {
  try {
    const posts = await getAllPosts();
    const featuredPosts = await getFeaturedPosts();
    
    return { 
      posts: posts.slice(0, 6), 
      featuredPosts 
    };
  } catch (error) {
    console.error('포스트 로딩 오류:', error);
    return { posts: [], featuredPosts: [] };
  }
}

async function getCategories() {
  try {
    const categories = await getAllCategories();
    return categories;
  } catch (error) {
    console.error('카테고리 로딩 오류:', error);
    return [];
  }
}

// 통계 데이터 가져오기
async function getStats() {
  try {
    const [posts, categories] = await Promise.all([
      getAllPosts(),
      getAllCategories()
    ]);

    const totalPosts = posts.length;
    const totalCategories = categories.length;
    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);

    return {
      totalPosts,
      totalCategories,
      totalViews,
      totalLikes,
      satisfactionRate: 95, // 고정값 (실제로는 사용자 피드백 기반)
      rating: 4.9 // 고정값 (실제로는 리뷰 기반)
    };
  } catch (error) {
    console.error('통계 데이터 로딩 오류:', error);
    return {
      totalPosts: 0,
      totalCategories: 0,
      totalViews: 0,
      totalLikes: 0,
      satisfactionRate: 95,
      rating: 4.9
    };
  }
}

// 메타데이터 생성
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Modern Blog - shadcn/ui 기반 현대적인 블로그',
    description: 'shadcn/ui와 Next.js로 구축된 현대적이고 아름다운 블로그입니다. 최신 웹 개발 트렌드와 기술을 공유합니다.',
    keywords: ['블로그', '웹 개발', 'shadcn/ui', 'Next.js', 'React', 'TypeScript', '프론트엔드', '백엔드', '디자인', '개발 팁'],
    authors: [{ name: 'Modern Blog Team' }],
    creator: 'Modern Blog',
    publisher: 'Modern Blog',
    robots: 'index, follow',
    openGraph: {
      title: 'Modern Blog - shadcn/ui 기반 현대적인 블로그',
      description: 'shadcn/ui와 Next.js로 구축된 현대적이고 아름다운 블로그입니다.',
      url: 'https://modern-blog.com',
      siteName: 'Modern Blog',
      locale: 'ko_KR',
      type: 'website',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=630&fit=crop',
          width: 1200,
          height: 630,
          alt: 'Modern Blog - 웹 개발 블로그',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@modernblog',
      title: 'Modern Blog - shadcn/ui 기반 현대적인 블로그',
      description: 'shadcn/ui와 Next.js로 구축된 현대적이고 아름다운 블로그입니다.',
      images: ['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=630&fit=crop'],
    },
  };
}

export default async function HomePage() {
  const [{ posts, featuredPosts }, categories, stats] = await Promise.all([
    getPosts(),
    getCategories(),
    getStats()
  ]);
  
  const mainFeaturedPost = featuredPosts[0];

  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      {mainFeaturedPost ? (
        <BlogHero featuredPost={mainFeaturedPost} />
      ) : (
        <section className="relative py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
          {/* 배경 패턴 */}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-white/5 to-transparent" />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-2xl">
              Modern Blog
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
              shadcn/ui와 Next.js로 구축된 현대적이고 아름다운 블로그입니다.
              <br />
              최신 웹 개발 트렌드와 기술을 공유합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-white/90 font-semibold shadow-lg">
                <Link href="/blog">
                  블로그 보기
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-white/50 text-white hover:bg-white hover:text-blue-600 font-medium">
                <Link href="/about">
                  소개 보기
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* 통계 섹션 */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{stats.totalPosts}+</div>
              <div className="text-sm text-muted-foreground">총 글 수</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-lg mx-auto mb-3">
                <Users className="h-6 w-6 text-green-500" />
              </div>
              <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">총 조회수</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500/10 rounded-lg mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <div className="text-2xl font-bold">{stats.satisfactionRate}%</div>
              <div className="text-sm text-muted-foreground">만족도</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-500/10 rounded-lg mx-auto mb-3">
                <Star className="h-6 w-6 text-orange-500" />
              </div>
              <div className="text-2xl font-bold">{stats.rating}</div>
              <div className="text-sm text-muted-foreground">평점</div>
            </div>
          </div>
        </div>
      </section>

      {/* 피처드 포스트 섹션 */}
      {featuredPosts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">추천 글</h2>
                <p className="text-muted-foreground">특별히 추천하는 인기 글들을 확인해보세요</p>
              </div>
              <Button asChild>
                <Link href="/blog">
                  모든 글 보기
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post: any) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 최신 글 섹션 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">최신 글</h2>
              <p className="text-muted-foreground">최신 기술과 트렌드를 담은 글들을 확인해보세요</p>
            </div>
            <Button asChild>
              <Link href="/blog">
                모든 글 보기
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.length > 0 ? (
              posts.map((post: any) => (
                <BlogCard key={post.id} post={post} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">아직 글이 없습니다</p>
                  <p className="text-sm">첫 번째 글을 작성해보세요!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">카테고리</h2>
            <p className="text-muted-foreground">관심 있는 주제별로 글을 찾아보세요</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category: any) => (
              <Card key={category.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">
                        {category.name[0]}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {category.actual_post_count || category.post_count || 0}개 글
                    </Badge>
                    <Button variant="ghost" size="sm" asChild className="group-hover:text-primary">
                      <Link href={`/blog/categories/${category.slug}`}>
                        보기
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 뉴스레터 섹션 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">뉴스레터 구독</h2>
                <p className="text-lg mb-6 text-blue-100">
                  최신 글과 업데이트를 이메일로 받아보세요. 
                  스팸은 절대 보내지 않습니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="이메일 주소를 입력하세요"
                    className="flex-1 px-4 py-3 rounded-md text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <Button className="bg-white text-blue-600 hover:bg-white/90">
                    구독하기
                  </Button>
                </div>
                <p className="text-sm text-blue-200 mt-4">
                  언제든지 구독을 취소할 수 있습니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 특별 기능 섹션 */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">특별 기능</h2>
            <p className="text-muted-foreground">더 나은 독서 경험을 위한 기능들</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">읽기 시간 표시</h3>
              <p className="text-muted-foreground">
                각 글의 예상 읽기 시간을 표시하여 독자들이 시간을 계획할 수 있도록 도와줍니다.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">진행률 표시</h3>
              <p className="text-muted-foreground">
                긴 글을 읽을 때 현재 위치를 시각적으로 표시하여 독서 진행률을 확인할 수 있습니다.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">북마크 기능</h3>
              <p className="text-muted-foreground">
                관심 있는 글을 북마크하여 나중에 쉽게 찾아볼 수 있습니다.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
