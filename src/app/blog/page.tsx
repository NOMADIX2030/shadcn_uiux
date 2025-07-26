import { BlogLayout } from '@/components/layout';
import { BlogCard } from '@/components/blog/blog-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid, List } from 'lucide-react';
import Link from 'next/link';
import { getAllPosts } from '@/lib/db/posts';
import { getAllCategories } from '@/lib/db/categories';

// 데이터베이스에서 직접 데이터 가져오기
async function getPosts() {
  try {
    const posts = await getAllPosts();
    return { 
      posts, 
      pagination: { 
        total: posts.length,
        page: 1,
        limit: 10,
        totalPages: Math.ceil(posts.length / 10),
        hasNext: false,
        hasPrev: false
      } 
    };
  } catch (error) {
    console.error('포스트 로딩 오류:', error);
    return { posts: [], pagination: { total: 0 } };
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

export default async function BlogListPage() {
  const { posts, pagination } = await getPosts();
  const categories = await getCategories();

  // 피처드 포스트를 먼저 정렬
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });



  return (
    <BlogLayout
      title="모든 글"
      description="최신 웹 개발 트렌드와 기술을 담은 모든 글을 확인해보세요"
      showSidebar={true}
      sidebar={
        <div className="space-y-6">
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

          {/* 카테고리 필터 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">카테고리</CardTitle>
            </CardHeader>
                      <CardContent className="space-y-2">
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/blog/categories/${category.slug}`}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {category.actual_post_count || category.post_count || 0}
                  </Badge>
                </Link>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">카테고리가 없습니다</p>
              </div>
            )}
          </CardContent>
          </Card>

          {/* 필터 옵션 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">필터</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="featured" className="rounded" />
                <label htmlFor="featured" className="text-sm">추천 글만 보기</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="recent" className="rounded" />
                <label htmlFor="recent" className="text-sm">최신 글만 보기</label>
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
                  <SelectItem value="featured">추천순</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      }
    >
      {/* 필터 및 정렬 바 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            총 {pagination.total}개의 글
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

      {/* 블로그 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(sortedPosts) && sortedPosts.length > 0 ? (
          sortedPosts.map((post: any) => (
            <BlogCard key={post.id} post={post} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-muted-foreground">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <p className="text-lg font-medium mb-2">아직 글이 없습니다</p>
              <p className="text-sm">첫 번째 글을 작성해보세요!</p>
            </div>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
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
    </BlogLayout>
  );
} 