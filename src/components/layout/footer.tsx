import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 섹션 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="font-bold text-xl">Blog</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              최신 웹 개발 트렌드와 기술을 공유하는 현대적인 블로그입니다.
              shadcn/ui와 Next.js로 구축되었습니다.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" asChild>
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link href="mailto:contact@blog.com">
                  <Mail className="h-4 w-4" />
                  <span className="sr-only">Email</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* 카테고리 섹션 */}
          <div className="space-y-4">
            <h3 className="font-semibold">카테고리</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog/categories/frontend" className="text-muted-foreground hover:text-foreground transition-colors">
                  프론트엔드
                </Link>
              </li>
              <li>
                <Link href="/blog/categories/backend" className="text-muted-foreground hover:text-foreground transition-colors">
                  백엔드
                </Link>
              </li>
              <li>
                <Link href="/blog/categories/design" className="text-muted-foreground hover:text-foreground transition-colors">
                  디자인
                </Link>
              </li>
              <li>
                <Link href="/blog/categories/tips" className="text-muted-foreground hover:text-foreground transition-colors">
                  개발 팁
                </Link>
              </li>
            </ul>
          </div>

          {/* 빠른 링크 섹션 */}
          <div className="space-y-4">
            <h3 className="font-semibold">빠른 링크</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  소개
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors">
                  기능
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  모든 글
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          {/* 뉴스레터 섹션 */}
          <div className="space-y-4">
            <h3 className="font-semibold">뉴스레터</h3>
            <p className="text-sm text-muted-foreground">
              최신 글과 업데이트를 받아보세요.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="이메일 주소"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <Button className="w-full" size="sm">
                구독하기
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                스팸 없음
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* 하단 섹션 */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>&copy; {currentYear} Blog. All rights reserved.</span>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              이용약관
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              Made with shadcn/ui
            </Badge>
            <Badge variant="outline" className="text-xs">
              Next.js 15
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
} 