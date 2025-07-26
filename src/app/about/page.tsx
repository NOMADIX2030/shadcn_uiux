import { PageLayout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Heart, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  Award,
  Target,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const teamMembers = [
    {
      name: '김개발',
      role: '프론트엔드 개발자',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'React, TypeScript, Next.js 전문가로 사용자 경험을 중시하는 웹 애플리케이션을 만드는 것을 좋아합니다.',
      social: {
        github: 'https://github.com/kimdev',
        twitter: 'https://twitter.com/kimdev',
        linkedin: 'https://linkedin.com/in/kimdev'
      }
    },
    {
      name: '이디자인',
      role: 'UI/UX 디자이너',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: '사용자 중심의 아름다운 인터페이스를 설계하며, 디자인 시스템과 접근성을 중요시합니다.',
      social: {
        github: 'https://github.com/leedesign',
        twitter: 'https://twitter.com/leedesign',
        linkedin: 'https://linkedin.com/in/leedesign'
      }
    }
  ];

  const stats = [
    { icon: BookOpen, value: '50+', label: '총 글 수' },
    { icon: Users, value: '10K+', label: '월간 독자' },
    { icon: TrendingUp, value: '95%', label: '만족도' },
    { icon: Award, value: '4.9', label: '평점' }
  ];

  const values = [
    {
      icon: Target,
      title: '사용자 중심',
      description: '사용자의 니즈를 최우선으로 고려하여 가치 있는 콘텐츠를 제공합니다.'
    },
    {
      icon: Zap,
      title: '혁신적 기술',
      description: '최신 기술 트렌드를 반영하여 항상 앞서가는 개발 정보를 공유합니다.'
    },
    {
      icon: Heart,
      title: '열정과 성장',
      description: '지속적인 학습과 개선을 통해 개발자 커뮤니티와 함께 성장합니다.'
    }
  ];

  return (
    <PageLayout
      title="소개"
      description="Modern Blog는 최신 웹 개발 트렌드와 기술을 공유하는 현대적인 블로그입니다."
      maxWidth="2xl"
    >
      {/* 미션 섹션 */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">우리의 미션</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            개발자들이 더 나은 코드를 작성하고, 더 효율적인 솔루션을 찾을 수 있도록 
            실용적이고 최신의 개발 정보를 제공하는 것이 우리의 목표입니다.
          </p>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 가치관 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {values.map((value, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500/10 rounded-lg mx-auto mb-4">
                  <value.icon className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-12" />

      {/* 팀 섹션 */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">팀 소개</h2>
          <p className="text-lg text-muted-foreground">
            Modern Blog를 만들어가는 열정적인 팀원들을 소개합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold">{member.name}</h3>
                      <Badge variant="secondary">{member.role}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{member.bio}</p>
                    <div className="flex space-x-2">
                      {member.social.github && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={member.social.github} target="_blank">
                            <Github className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      {member.social.twitter && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={member.social.twitter} target="_blank">
                            <Twitter className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      {member.social.linkedin && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={member.social.linkedin} target="_blank">
                            <Linkedin className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-12" />

      {/* 연락처 섹션 */}
      <section className="py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">함께 성장해요</h2>
        <p className="text-lg text-muted-foreground mb-8">
          궁금한 점이나 제안사항이 있으시면 언제든 연락주세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="mailto:contact@modernblog.com">
              <Mail className="h-4 w-4 mr-2" />
              이메일 보내기
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/features">
              기능 둘러보기
            </Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
} 