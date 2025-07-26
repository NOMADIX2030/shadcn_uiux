import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Calendar, Clock, Eye, Heart } from 'lucide-react';
import { BlogPost } from '@/types/blog';


interface BlogHeroProps {
  featuredPost: BlogPost | any; // API 데이터도 허용
}

export function BlogHero({ featuredPost }: BlogHeroProps) {
  // API 데이터 구조에 맞게 매핑
  const post = 'category_color' in featuredPost ? {
    ...featuredPost,
    category: {
      name: featuredPost.category_name,
      color: featuredPost.category_color
    },
    author: {
      name: featuredPost.author_name,
      avatar: featuredPost.author_avatar
    },
    featuredImage: featuredPost.featured_image,
    publishedAt: featuredPost.published_at,
    readingTime: featuredPost.reading_time,
    views: featuredPost.views,
    likes: featuredPost.likes
  } : featuredPost;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        {/* 더 강한 그라데이션 오버레이로 텍스트 가독성 향상 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        {/* 텍스트 가독성을 위한 추가 오버레이 */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* 콘텐츠 */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* 텍스트 콘텐츠 */}
          <div className="space-y-6 text-white">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge 
                  className="text-sm px-3 py-1 font-medium" 
                  style={{ backgroundColor: post.category.color }}
                >
                  {post.category.name}
                </Badge>
                <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium">
                  추천
                </Badge>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-white drop-shadow-2xl">
                {post.title}
              </h1>
              <p className="text-lg lg:text-xl text-white leading-relaxed drop-shadow-lg max-w-2xl font-medium">
                {post.excerpt}
              </p>
            </div>

            {/* 메타 정보 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white font-semibold text-sm">
                    {post.author.name[0]}
                  </span>
                </div>
                <span className="font-medium">{post.author.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime}분 읽기</span>
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-white text-black hover:bg-white/90 font-semibold shadow-lg">
                <Link href={`/blog/${post.slug}`}>
                  글 읽기
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white/50 text-white hover:bg-white hover:text-black font-medium backdrop-blur-sm">
                <Link href="/blog">
                  모든 글 보기
                </Link>
              </Button>
            </div>

            {/* 통계 */}
            <div className="flex items-center space-x-6 pt-4 border-t border-white/30">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-white/90" />
                <span className="text-sm font-medium text-white/90">{post.views.toLocaleString()} 조회</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-white/90" />
                <span className="text-sm font-medium text-white/90">{post.likes} 좋아요</span>
              </div>
            </div>
          </div>

          {/* 카드 형태의 미리보기 */}
          <div className="hidden lg:block">
            <Card className="bg-white/15 backdrop-blur-md border-white/30 text-white shadow-2xl">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-white/25 text-white font-medium">
                        {post.category.name}
                      </Badge>
                      <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                        추천
                      </Badge>
                    </div>
                    <span className="text-sm text-white/80 font-medium">
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold line-clamp-3 text-white drop-shadow-lg">
                    {post.title}
                  </h3>
                  <p className="text-white/90 line-clamp-3 font-medium">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/30">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white font-semibold text-xs">
                          {post.author.name[0]}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-white/90">{post.author.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/25">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
} 