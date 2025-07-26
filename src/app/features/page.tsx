import { PageLayout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  TrendingUp, 
  Star, 
  Search, 
  Moon,
  Smartphone,
  Tablet,
  Monitor,
  Zap,
  Shield,
  Heart,
  Eye,
  Clock,
  Bookmark,
  Share2,
  Download,
  Play
} from 'lucide-react';
import Link from 'next/link';

export default function FeaturesPage() {
  const features = [
    {
      icon: BookOpen,
      title: '읽기 시간 표시',
      description: '각 글의 예상 읽기 시간을 표시하여 독자들이 시간을 계획할 수 있도록 도와줍니다.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: TrendingUp,
      title: '진행률 표시',
      description: '긴 글을 읽을 때 현재 위치를 시각적으로 표시하여 독서 진행률을 확인할 수 있습니다.',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: Star,
      title: '북마크 기능',
      description: '관심 있는 글을 북마크하여 나중에 쉽게 찾아볼 수 있습니다.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Search,
      title: '고급 검색',
      description: '제목, 내용, 태그별로 정확한 검색이 가능하며 검색 히스토리를 제공합니다.',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      icon: Moon,
      title: '다크모드',
      description: '눈의 피로를 줄이는 다크모드를 지원하여 더 나은 독서 경험을 제공합니다.',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10'
    },
    {
      icon: Share2,
      title: '소셜 공유',
      description: '좋은 글을 소셜 미디어에 쉽게 공유할 수 있는 기능을 제공합니다.',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10'
    }
  ];

  const responsiveFeatures = [
    {
      icon: Smartphone,
      title: '모바일 최적화',
      description: '모든 모바일 기기에서 완벽하게 작동하는 반응형 디자인',
      devices: ['iPhone', 'Android', 'Tablet']
    },
    {
      icon: Tablet,
      title: '태블릿 친화적',
      description: '태블릿에서도 최적화된 레이아웃과 터치 인터페이스',
      devices: ['iPad', 'Android Tablet', 'Surface']
    },
    {
      icon: Monitor,
      title: '데스크톱 경험',
      description: '큰 화면에서도 최고의 사용자 경험을 제공하는 디자인',
      devices: ['Desktop', 'Laptop', 'Ultra-wide']
    }
  ];

  const upcomingFeatures = [
    {
      icon: Download,
      title: '오프라인 읽기',
      description: '인터넷 연결 없이도 저장된 글을 읽을 수 있습니다.',
      status: '개발 중'
    },
    {
      icon: Play,
      title: '음성 읽기',
      description: '글을 음성으로 들을 수 있는 TTS 기능을 제공합니다.',
      status: '계획 중'
    },
    {
      icon: Heart,
      title: '개인화 추천',
      description: '사용자의 관심사를 분석하여 맞춤형 글을 추천합니다.',
      status: '계획 중'
    }
  ];

  return (
    <PageLayout
      title="특별 기능"
      description="Modern Blog만의 특별한 기능들을 확인해보세요. 더 나은 독서 경험을 위한 다양한 기능을 제공합니다."
      maxWidth="full"
    >
      {/* 주요 기능 섹션 */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">주요 기능</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            독자들의 더 나은 독서 경험을 위해 특별히 설계된 기능들입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className={`flex items-center justify-center w-12 h-12 ${feature.bgColor} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-12" />

      {/* 반응형 디자인 섹션 */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">모든 기기에서 완벽한 경험</h2>
          <p className="text-lg text-muted-foreground">
            어떤 기기에서든 최적화된 사용자 경험을 제공합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {responsiveFeatures.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {feature.devices.map((device, deviceIndex) => (
                    <Badge key={deviceIndex} variant="outline" className="text-xs">
                      {device}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-12" />

      {/* 접근성 섹션 */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">접근성 최적화</h2>
          <p className="text-lg text-muted-foreground">
            모든 사용자가 동등하게 이용할 수 있도록 접근성을 중요시합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">WCAG 2.1 AA 준수</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                국제 웹 접근성 가이드라인을 완전히 준수하여 모든 사용자가 
                동등하게 이용할 수 있도록 설계되었습니다.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Eye className="h-4 w-4 text-green-500" />
                  <span>스크린 리더 지원</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Zap className="h-4 w-4 text-green-500" />
                  <span>키보드 네비게이션</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span>충분한 시간 제공</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold">사용자 친화적</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                직관적이고 사용하기 쉬운 인터페이스로 모든 연령대의 
                사용자가 쉽게 이용할 수 있습니다.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Bookmark className="h-4 w-4 text-blue-500" />
                  <span>직관적인 네비게이션</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Search className="h-4 w-4 text-blue-500" />
                  <span>빠른 검색 기능</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Share2 className="h-4 w-4 text-blue-500" />
                  <span>쉬운 공유 기능</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-12" />

      {/* 예정 기능 섹션 */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">곧 출시될 기능</h2>
          <p className="text-lg text-muted-foreground">
            더 나은 서비스를 위해 준비 중인 새로운 기능들입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingFeatures.map((feature, index) => (
            <Card key={index} className="border-dashed">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {feature.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-12 text-center">
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
            <p className="text-lg mb-6 text-blue-100">
              Modern Blog의 특별한 기능들을 직접 경험해보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/blog">
                  글 둘러보기
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <Link href="/about">
                  더 알아보기
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </PageLayout>
  );
} 