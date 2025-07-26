import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Eye, Heart, ArrowRight } from 'lucide-react';
import { BlogCardProps, ApiBlogPost } from '@/types/blog';


export function BlogCard({ post, variant = 'default' }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // API 데이터인지 확인하는 타입 가드
  const isApiPost = (post: any): post is ApiBlogPost => {
    return 'author_name' in post && 'category_name' in post;
  };

  // 데이터 구조 통일
  const postData = isApiPost(post) ? {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    featuredImage: post.featured_image,
    publishedAt: post.published_at,
    readingTime: post.reading_time,
    views: post.views,
    likes: post.likes,
    featured: post.featured,
    author: {
      name: post.author_name,
      avatar: post.author_avatar
    },
    category: {
      name: post.category_name,
      color: post.category_color
    }
  } : post;

  if (variant === 'featured') {
    return (
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={postData.featuredImage}
            alt={postData.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge style={{ backgroundColor: postData.category.color }}>
                {postData.category.name}
              </Badge>
              {postData.featured && (
                <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                  추천
                </Badge>
              )}
            </div>
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
              {postData.title}
            </h3>
            <p className="text-white/90 text-sm line-clamp-2 mb-3">
              {postData.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={postData.author.avatar} alt={postData.author.name} />
                  <AvatarFallback>{postData.author.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-white/80 text-xs">{postData.author.name}</span>
              </div>
              <div className="flex items-center space-x-4 text-white/70 text-xs">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(postData.publishedAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{postData.readingTime}분</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{postData.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-3 w-3" />
                <span>{postData.likes}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/blog/${postData.slug}`}>
                자세히 보기
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className="group hover:shadow-md transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={postData.featuredImage}
                alt={postData.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Badge variant="secondary" className="text-xs">
                  {postData.category.name}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(postData.publishedAt)}
                </span>
              </div>
              <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                <Link href={`/blog/${postData.slug}`}>
                  {postData.title}
                </Link>
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {postData.excerpt}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={postData.featuredImage}
          alt={postData.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge style={{ backgroundColor: postData.category.color }}>
            {postData.category.name}
          </Badge>
        </div>
        {postData.featured && (
          <div className="absolute top-3 right-3">
            <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
              추천
            </Badge>
          </div>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center space-x-2 mb-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={postData.author.avatar} alt={postData.author.name} />
            <AvatarFallback>{postData.author.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{postData.author.name}</span>
        </div>
        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/blog/${postData.slug}`}>
            {postData.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {postData.excerpt}
        </p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(postData.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{postData.readingTime}분</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              <span>{postData.views.toLocaleString()}</span>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/blog/${postData.slug}`}>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}