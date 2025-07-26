import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Modern Blog - shadcn/ui 기반 현대적인 블로그",
    template: "%s | Modern Blog"
  },
  description: "shadcn/ui와 Next.js로 구축된 현대적이고 아름다운 블로그입니다. 최신 웹 개발 트렌드와 기술을 공유합니다.",
  keywords: [
    "블로그", 
    "웹 개발", 
    "shadcn/ui", 
    "Next.js", 
    "React", 
    "TypeScript", 
    "프론트엔드", 
    "백엔드", 
    "디자인", 
    "개발 팁"
  ],
  authors: [{ name: "Modern Blog Team" }],
  creator: "Modern Blog",
  publisher: "Modern Blog",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://modern-blog.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://modern-blog.com",
    title: "Modern Blog - shadcn/ui 기반 현대적인 블로그",
    description: "shadcn/ui와 Next.js로 구축된 현대적이고 아름다운 블로그입니다.",
    siteName: "Modern Blog",
    images: [
      {
        url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Modern Blog - 웹 개발 블로그",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modern Blog - shadcn/ui 기반 현대적인 블로그",
    description: "shadcn/ui와 Next.js로 구축된 현대적이고 아름다운 블로그입니다.",
    images: ["https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=630&fit=crop"],
    creator: "@modernblog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 구조화된 데이터 - 블로그 정보 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "Modern Blog",
              "description": "shadcn/ui와 Next.js로 구축된 현대적이고 아름다운 블로그입니다.",
              "url": "https://modern-blog.com",
              "publisher": {
                "@type": "Organization",
                "name": "Modern Blog Team",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://modern-blog.com/logo.png"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://modern-blog.com"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://modern-blog.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
