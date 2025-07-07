import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientThemeWrapper from './ClientThemeWrapper';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Runmates - ランニング記録管理アプリ",
  description: "ランニング記録の管理、目標設定、進捗追跡を行うアプリケーション。月間・年間目標を設定し、データ可視化でモチベーションを維持しましょう。",
  keywords: ["ランニング", "記録", "目標", "健康", "運動", "トレーニング", "データ可視化"],
  authors: [{ name: "Runmates Team" }],
  creator: "Runmates Team",
  publisher: "Runmates Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    siteName: "Runmates",
    title: "Runmates - ランニング記録管理アプリ",
    description: "ランニング記録の管理、目標設定、進捗追跡を行うアプリケーション。月間・年間目標を設定し、データ可視化でモチベーションを維持しましょう。",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Runmates アプリ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Runmates - ランニング記録管理アプリ",
    description: "ランニング記録の管理、目標設定、進捗追跡を行うアプリケーション。",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="emotion-insertion-point" content="" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientThemeWrapper>
          {children}
        </ClientThemeWrapper>
      </body>
    </html>
  );
}
