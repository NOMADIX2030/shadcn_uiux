import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BlogLayout } from '@/components/layout';
import { BlogCard } from '@/components/blog/blog-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Grid, 
  List, 
  BookOpen,
  Calendar,
  User,
  Tag,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { getAllPosts } from '@/lib/db/posts';
import { getAllCategories } from '@/lib/db/categories';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 정적 경로 생성
export async function generateStaticParams() {
  try {
    const categories = await getAllCategories();
    return categories.map((category) => ({
      slug: category.slug,
    }));
  } catch (error) {
    console.error('정적 경로 생성 오류:', error);
    return [];
  }
}

// 메타데이터 생성 함수
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const categories = await getAllCategories();
    const category = categories.find(cat => cat.slug === slug);
    
    if (!category) {
      return {
        title: '카테고리를 찾을 수 없습니다',
      };
    }

    return {
      title: `${category.name} - Modern Blog`,
      description: category.description,
      keywords: [category.name, '블로그', '개발', '기술'],
      openGraph: {
        title: `${category.name} 카테고리 - Modern Blog`,
        description: category.description,
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: '카테고리를 찾을 수 없습니다',
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  try {
    const [categories, allPosts] = await Promise.all([
      getAllCategories(),
      getAllPosts()
    ]);
    
    const category = categories.find(cat => cat.slug === slug);
    
    if (!category) {
      notFound();
    }

    const posts = allPosts.filter(post => post.category_slug === slug);

    return (
      <BlogLayout
        title={category.name}
        description={category.description}
        showSidebar={true}
        sidebar={
          <div className="space-y-6">
            {/* 카테고리 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full ${category.color}`} />
                  <span>{category.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">총 글 수</span>
                  <Badge variant="secondary">{category.actual_post_count}개</Badge>
                </div>
              </CardContent>
            </Card>

            {/* 검색 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">검색</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="글 검색..." className="pl-10" />
                </div>
              </CardContent>
            </Card>

            {/* 정렬 옵션 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">정렬</CardTitle>
              </CardHeader>
              <CardContent>
                <Select defaultValue="latest">
                  <SelectTrigger>
                    <SelectValue placeholder="정렬 기준" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">최신순</SelectItem>
                    <SelectItem value="popular">인기순</SelectItem>
                    <SelectItem value="oldest">오래된순</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* 다른 카테고리 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">다른 카테고리</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories
                  .filter(cat => cat.slug !== slug)
                  .map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/blog/categories/${cat.slug}`}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                        <span className="text-sm">{cat.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {cat.actual_post_count}
                      </Badge>
                    </Link>
                  ))}
              </CardContent>
            </Card>
          </div>
        }
      >
        {/* 메인 콘텐츠 */}
        <div className="space-y-8">
          {/* 카테고리 헤더 */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className={`w-6 h-6 rounded-full ${category.color}`} />
              <h1 className="text-3xl font-bold">{category.name}</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {category.description}
            </p>
          </div>

          {/* 통계 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-sm text-muted-foreground">총 글 수</div>
                <div className="font-semibold">{posts.length}개</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-sm text-muted-foreground">최신 글</div>
                <div className="font-semibold">
                  {posts.length > 0 
                    ? new Date(posts[0].published_at).toLocaleDateString('ko-KR', { 
                        month: 'short', 
                        day: 'numeric' 
                      })
                    : '없음'
                  }
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
              <User className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-sm text-muted-foreground">작성자</div>
                <div className="font-semibold">
                  {new Set(posts.map(post => post.author_name)).size}명
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
              <Tag className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-sm text-muted-foreground">총 조회수</div>
                <div className="font-semibold">
                  {posts.reduce((sum, post) => sum + (post.views || 0), 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* 필터 및 정렬 바 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {posts.length}개의 글
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 글 목록 */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">아직 글이 없습니다</h3>
              <p className="text-muted-foreground mb-4">
                이 카테고리의 첫 번째 글을 작성해보세요!
              </p>
              <Button asChild>
                <Link href="/blog">
                  다른 카테고리 보기
                </Link>
              </Button>
            </div>
          )}

          {/* 페이지네이션 */}
          {posts.length > 0 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  이전
                </Button>
                <Button variant="outline" size="sm">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  다음
                </Button>
              </div>
            </div>
          )}
        </div>
      </BlogLayout>
    );
  } catch (error) {
    console.error('카테고리 페이지 오류:', error);
    notFound();
  }
}