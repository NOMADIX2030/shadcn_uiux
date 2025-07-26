'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, Save, Eye, Send, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import { BlogLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { getAuthUser, logout } from '@/lib/auth';

// 폼 검증 스키마
const postSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(255, '제목은 255자 이하여야 합니다'),
  slug: z.string().min(1, '슬러그를 입력해주세요').max(255, '슬러그는 255자 이하여야 합니다'),
  excerpt: z.string().min(1, '요약을 입력해주세요').max(500, '요약은 500자 이하여야 합니다'),
  content: z.string().min(1, '본문을 입력해주세요'),
  category_id: z.string().min(1, '카테고리를 선택해주세요'),
  featured_image: z.string().min(1, '대표 이미지를 업로드해주세요'),
  featured: z.boolean(),
  status: z.enum(['draft', 'published']),
  tags: z.array(z.string()),
  reading_time: z.number().min(1).max(120)
});

type PostFormData = z.infer<typeof postSchema>;

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState(getAuthUser());

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      featured: false,
      status: 'draft',
      reading_time: 5,
      tags: []
    }
  });

  const watchedTitle = watch('title');
  const watchedContent = watch('content');

  // 카테고리와 태그 로딩
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/tags')
        ]);

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData.data?.categories || []);
        }

        if (tagsRes.ok) {
          const tagsData = await tagsRes.json();
          setTags(tagsData.data?.tags || []);
        }
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
      }
    };

    fetchData();
  }, []);

  // 제목에서 자동 슬러그 생성
  useEffect(() => {
    if (watchedTitle) {
      // 한글을 영문으로 변환하는 간단한 매핑
      const koreanToEnglish: { [key: string]: string } = {
        '가': 'ga', '나': 'na', '다': 'da', '라': 'ra', '마': 'ma', '바': 'ba', '사': 'sa', '아': 'a', '자': 'ja', '차': 'cha', '카': 'ka', '타': 'ta', '파': 'pa', '하': 'ha',
        '각': 'gak', '낙': 'nak', '닥': 'dak', '락': 'rak', '막': 'mak', '박': 'bak', '삭': 'sak', '악': 'ak', '작': 'jak', '착': 'chak', '칵': 'kak', '탁': 'tak', '팍': 'pak', '학': 'hak',
        '간': 'gan', '난': 'nan', '단': 'dan', '란': 'ran', '만': 'man', '반': 'ban', '산': 'san', '안': 'an', '잔': 'jan', '찬': 'chan', '칸': 'kan', '탄': 'tan', '판': 'pan', '한': 'han',
        '갈': 'gal', '날': 'nal', '달': 'dal', '랄': 'ral', '말': 'mal', '발': 'bal', '살': 'sal', '알': 'al', '잘': 'jal', '찰': 'chal', '칼': 'kal', '탈': 'tal', '팔': 'pal', '할': 'hal',
        '감': 'gam', '남': 'nam', '담': 'dam', '람': 'ram', '맘': 'mam', '밤': 'bam', '삼': 'sam', '암': 'am', '잠': 'jam', '참': 'cham', '캄': 'kam', '탐': 'tam', '팜': 'pam', '함': 'ham',
        '개': 'gae', '내': 'nae', '대': 'dae', '래': 'rae', '매': 'mae', '배': 'bae', '새': 'sae', '애': 'ae', '재': 'jae', '채': 'chae', '캐': 'kae', '태': 'tae', '패': 'pae', '해': 'hae',
        '거': 'geo', '너': 'neo', '더': 'deo', '러': 'reo', '머': 'meo', '버': 'beo', '서': 'seo', '어': 'eo', '저': 'jeo', '처': 'cheo', '커': 'keo', '터': 'teo', '퍼': 'peo', '허': 'heo',
        '고': 'go', '노': 'no', '도': 'do', '로': 'ro', '모': 'mo', '보': 'bo', '소': 'so', '오': 'o', '조': 'jo', '초': 'cho', '코': 'ko', '토': 'to', '포': 'po', '호': 'ho',
        '구': 'gu', '누': 'nu', '두': 'du', '루': 'ru', '무': 'mu', '부': 'bu', '수': 'su', '우': 'u', '주': 'ju', '추': 'chu', '쿠': 'ku', '투': 'tu', '푸': 'pu', '후': 'hu',
        '글': 'geul', '늘': 'neul', '들': 'deul', '를': 'reul', '믈': 'meul', '블': 'beul', '슬': 'seul', '을': 'eul', '즐': 'jeul', '츨': 'cheul', '큘': 'keul', '틀': 'teul', '플': 'peul', '흘': 'heul',
        '기': 'gi', '니': 'ni', '디': 'di', '리': 'ri', '미': 'mi', '비': 'bi', '시': 'si', '이': 'i', '지': 'ji', '치': 'chi', '키': 'ki', '티': 'ti', '피': 'pi', '히': 'hi',
        '김': 'kim', '임': 'im', '심': 'sim', '정': 'jeong', '성': 'seong', '영': 'yeong', '명': 'myeong', '경': 'gyeong', '형': 'hyeong', '동': 'dong', '통': 'tong', '공': 'gong', '용': 'yong', '강': 'gang',
        '개발': 'development', '프로그래밍': 'programming', '웹': 'web', '앱': 'app', '모바일': 'mobile', '데스크톱': 'desktop', '서버': 'server', '클라이언트': 'client', '데이터베이스': 'database', 'API': 'api', '프레임워크': 'framework', '라이브러리': 'library', '도구': 'tool', '기술': 'technology'
      };

      let processedTitle = watchedTitle;
      
      // 한글을 영문으로 변환
      Object.keys(koreanToEnglish).forEach(korean => {
        processedTitle = processedTitle.replace(new RegExp(korean, 'g'), koreanToEnglish[korean]);
      });

      const slug = processedTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // 영문/숫자/하이픈만 허용
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') // 앞뒤 하이픈 제거
        .trim();
      
      // 슬러그가 비어있거나 너무 짧으면 기본값 설정
      const finalSlug = slug && slug.length > 2 ? slug : `post-${Date.now()}`;
      setValue('slug', finalSlug);
    }
  }, [watchedTitle, setValue]);

  // 읽기 시간 자동 계산
  useEffect(() => {
    if (watchedContent) {
      const wordCount = watchedContent.split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // 분당 200단어 기준
      setValue('reading_time', readingTime);
    }
  }, [watchedContent, setValue]);

  // 이미지 URL 처리
  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    setValue('featured_image', url);
  };

  // 이미지 URL 유효성 검사 및 미리보기
  const validateAndPreviewImage = async (url: string) => {
    if (!url.trim()) {
      setImagePreview('');
      setImageLoading(false);
      return;
    }

    setImageLoading(true);
    try {
      // URL 형식 검증 (더 유연한 패턴)
      const urlPattern = /^https?:\/\/.+/i;
      if (!urlPattern.test(url)) {
        throw new Error('유효한 URL이 아닙니다 (http:// 또는 https://로 시작해야 합니다)');
      }

      // 이미지 확장자 검증 (URL에 확장자가 없어도 허용)
      const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;
      if (!imageExtensions.test(url) && !url.includes('unsplash.com') && !url.includes('pexels.com')) {
        console.warn('이미지 확장자가 감지되지 않았습니다. URL을 확인해주세요.');
      }

      // 이미지 로드 테스트 (타임아웃 설정)
      const img = new Image();
      const timeout = setTimeout(() => {
        img.src = '';
        setImageLoading(false);
        alert('이미지 로딩 시간이 초과되었습니다');
      }, 10000); // 10초 타임아웃

      img.onload = () => {
        clearTimeout(timeout);
        setImagePreview(url);
        setImageLoading(false);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        throw new Error('이미지를 불러올 수 없습니다. URL을 확인해주세요.');
      };
      
      img.src = url;
    } catch (error) {
      console.error('이미지 검증 오류:', error);
      setImagePreview('');
      setImageLoading(false);
      alert(error instanceof Error ? error.message : '유효한 이미지 URL을 입력해주세요');
    }
  };

  // 태그 추가
  const addTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      const tagToAdd = newTag.trim();
      setSelectedTags([...selectedTags, tagToAdd]);
      setValue('tags', [...selectedTags, tagToAdd]);
      setNewTag('');
    }
  };

  // 태그 제거
  const removeTag = (tagToRemove: string) => {
    const updatedTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(updatedTags);
    setValue('tags', updatedTags);
  };

  // 폼 제출
  const onSubmit = async (data: PostFormData) => {
    setIsLoading(true);
    try {
      // 현재 로그인한 사용자 ID 사용
      if (!currentUser) {
        alert('로그인이 필요합니다');
        router.push('/login');
        return;
      }

      const postData = {
        ...data,
        author_id: currentUser.id,
        published_at: data.status === 'published' ? new Date().toISOString() : null
      };

      console.log('전송할 데이터:', postData);

      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      console.log('응답 상태:', response.status);
      console.log('응답 헤더:', Object.fromEntries(response.headers.entries()));
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('응답 데이터:', responseData);
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError);
        const textResponse = await response.text();
        console.log('텍스트 응답:', textResponse);
        throw new Error('서버 응답을 파싱할 수 없습니다');
      }

      if (response.ok) {
        alert('포스트가 성공적으로 등록되었습니다!');
        router.push(`/blog/${responseData.data.slug}`);
      } else {
        const errorMessage = responseData.message || responseData.error || '알 수 없는 오류가 발생했습니다';
        alert(`등록 실패: ${errorMessage}`);
      }
    } catch (error) {
      console.error('포스트 등록 오류:', error);
      alert('포스트 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <ProtectedRoute>
      <BlogLayout
        title="새 글 작성"
        description="새로운 블로그 글을 작성하세요"
        showSidebar={false}
      >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">새 글 작성</h1>
            <p className="text-muted-foreground">새로운 블로그 글을 작성하고 공유하세요</p>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="text-sm text-muted-foreground">
                작성자: <span className="font-medium">{currentUser.name}</span>
              </div>
            )}
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              뒤로 가기
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>글의 기본 정보를 입력하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 제목 */}
              <div className="space-y-2">
                <Label htmlFor="title">제목 *</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="글의 제목을 입력하세요"
                />
                {errors.title && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.title.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* 슬러그 */}
              <div className="space-y-2">
                <Label htmlFor="slug">슬러그 *</Label>
                <Input
                  id="slug"
                  {...register('slug')}
                  placeholder="URL에 사용될 슬러그를 입력하세요"
                />
                {errors.slug && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.slug.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* 요약 */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">요약 *</Label>
                <Textarea
                  id="excerpt"
                  {...register('excerpt')}
                  placeholder="글의 요약을 입력하세요 (500자 이내)"
                  rows={3}
                />
                {errors.excerpt && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.excerpt.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 카테고리 및 태그 */}
          <Card>
            <CardHeader>
              <CardTitle>분류</CardTitle>
              <CardDescription>카테고리와 태그를 선택하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 카테고리 */}
              <div className="space-y-2">
                <Label htmlFor="category">카테고리 *</Label>
                <Select onValueChange={(value) => setValue('category_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${category.color}`} />
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category_id && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.category_id.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* 태그 */}
              <div className="space-y-2">
                <Label>태그</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="새 태그 입력"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    추가
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 대표 이미지 */}
          <Card>
            <CardHeader>
              <CardTitle>대표 이미지 *</CardTitle>
              <CardDescription>글을 대표할 이미지를 업로드하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-url">이미지 URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="image-url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => {
                      const url = e.target.value;
                      setImageUrl(url);
                      handleImageUrlChange(url);
                    }}
                    onBlur={(e) => validateAndPreviewImage(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => validateAndPreviewImage(imageUrl)}
                    disabled={imageLoading}
                  >
                    {imageLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImageIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {/* 빠른 이미지 URL 선택 */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">빠른 선택:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
                      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
                      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
                      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop'
                    ].map((url, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setImageUrl(url);
                          handleImageUrlChange(url);
                          validateAndPreviewImage(url);
                        }}
                        className="text-xs"
                      >
                        이미지 {index + 1}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  지원 형식: JPG, PNG, GIF, WebP, SVG (https:// 또는 http://로 시작)
                </p>
                {errors.featured_image && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.featured_image.message}</AlertDescription>
                  </Alert>
                )}
              </div>
              
              {/* 이미지 미리보기 */}
              {imageLoading && (
                <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>이미지 로딩 중...</span>
                  </div>
                </div>
              )}
              
              {imagePreview && !imageLoading && (
                <div className="space-y-2">
                  <Label>미리보기</Label>
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <img
                      src={imagePreview}
                      alt="미리보기"
                      className="w-full h-full object-cover"
                      onError={() => {
                        setImagePreview('');
                        alert('이미지를 불러올 수 없습니다');
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImageUrl('');
                        setImagePreview('');
                        setValue('featured_image', '');
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 본문 */}
          <Card>
            <CardHeader>
              <CardTitle>본문 *</CardTitle>
              <CardDescription>글의 내용을 작성하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Textarea
                  {...register('content')}
                  placeholder="글의 내용을 작성하세요..."
                  rows={15}
                  className="font-mono"
                />
                {errors.content && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.content.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 설정 */}
          <Card>
            <CardHeader>
              <CardTitle>설정</CardTitle>
              <CardDescription>글의 추가 설정을 구성하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 읽기 시간 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>예상 읽기 시간</Label>
                  <p className="text-sm text-muted-foreground">
                    자동 계산: 약 {watch('reading_time')}분
                  </p>
                </div>
                <Input
                  type="number"
                  {...register('reading_time', { valueAsNumber: true })}
                  className="w-20"
                  min="1"
                  max="120"
                />
              </div>

              {/* 피처드 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>추천 글로 설정</Label>
                  <p className="text-sm text-muted-foreground">
                    메인 페이지에 추천 글로 표시됩니다
                  </p>
                </div>
                <Switch
                  checked={watch('featured')}
                  onCheckedChange={(checked) => setValue('featured', checked)}
                />
              </div>

              {/* 발행 상태 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>발행 상태</Label>
                  <p className="text-sm text-muted-foreground">
                    글의 발행 상태를 선택하세요
                  </p>
                </div>
                <Select onValueChange={(value) => setValue('status', value as 'draft' | 'published')}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">임시저장</SelectItem>
                    <SelectItem value="published">발행</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 액션 버튼 */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {isPreviewMode ? '편집' : '미리보기'}
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button
                type="submit"
                variant="outline"
                onClick={() => setValue('status', 'draft')}
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                임시저장
              </Button>
              <Button
                type="submit"
                onClick={() => setValue('status', 'published')}
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                발행하기
              </Button>
            </div>
          </div>
        </form>
      </div>
    </BlogLayout>
    </ProtectedRoute>
  );
} 