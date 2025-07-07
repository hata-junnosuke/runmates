import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientThemeWrapper from './ClientThemeWrapper';

// フォント設定: GeistSansとGeistMonoを使用
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 本番環境とローカル環境に対応したベースURLを取得
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';
  }
  return 'https://runmates.net';
};

// アプリケーション全体のメタデータ設定
// SEO、OGP、ファビコンなどの設定を含む
export const metadata: Metadata = {
  // 基本的なメタデータ
  title: "Runmates - ランニング記録管理アプリ",
  description: "ランニング記録の管理、目標設定、進捗追跡を行うアプリケーション。月間・年間目標を設定し、データ可視化でモチベーションを維持しましょう。",
  keywords: ["ランニング", "記録", "目標", "健康", "運動", "トレーニング", "データ可視化"],
  
  // 作成者情報
  authors: [{ name: "Runmates Team" }],
  creator: "Runmates Team",
  publisher: "Runmates Team",
  
  // 自動検出の無効化（セキュリティ向上）
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // ファビコン設定 - 絶対URLを使用してどのページからでも表示可能
  icons: {
    icon: `${getBaseUrl()}/logo.png`,
    shortcut: `${getBaseUrl()}/logo.png`,
    apple: `${getBaseUrl()}/logo.png`,
  },
  
  // OGP設定 - SNSでのシェア時に表示される情報
  openGraph: {
    type: "website",
    siteName: "Runmates",
    title: "Runmates - ランニング記録管理アプリ",
    description: "ランニング記録の管理、目標設定、進捗追跡を行うアプリケーション。月間・年間目標を設定し、データ可視化でモチベーションを維持しましょう。",
    images: [
      {
        url: `${getBaseUrl()}/logo.png`, // 絶対URLで画像を指定
        width: 1200,
        height: 630,
        alt: "Runmates アプリ",
      },
    ],
  },
  
  // Twitter Card設定 - Twitterでのシェア時の表示
  twitter: {
    card: "summary_large_image",
    title: "Runmates - ランニング記録管理アプリ",
    description: "ランニング記録の管理、目標設定、進捗追跡を行うアプリケーション。",
    images: [`${getBaseUrl()}/logo.png`], // 絶対URLで画像を指定
  },
  
  // 検索エンジン向けの設定
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

// ルートレイアウトコンポーネント
// 全てのページで共通のHTML構造とスタイルを提供
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja"> {/* 日本語サイトであることを明示 */}
      <head>
        {/* Material-UIのEmotionキャッシュの挿入ポイント */}
        <meta name="emotion-insertion-point" content="" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Material-UIのテーマプロバイダーでアプリケーション全体をラップ */}
        <ClientThemeWrapper>
          {children}
        </ClientThemeWrapper>
      </body>
    </html>
  );
}
