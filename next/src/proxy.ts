import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// 認証が不要なパス（公開ページ）
const publicPaths = [
  '/login',
  '/create-account',
  '/forgot-password',
  '/reset-password',
  '/confirm-email',
];

// 認証チェックをスキップするパス
const excludePaths = [
  '/api',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 除外パスの場合は何もしない
  if (excludePaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 公開パスの場合は何もしない
  if (publicPaths.some((path) => pathname === path)) {
    return NextResponse.next();
  }

  // 認証トークンの確認
  const accessToken = request.cookies.get('access-token');
  const client = request.cookies.get('client');
  const uid = request.cookies.get('uid');

  // 認証トークンが全て存在しない場合はログインページへリダイレクト
  if (!accessToken || !client || !uid) {
    const loginUrl = new URL('/login', request.url);
    // 元のURLをクエリパラメータとして保持（将来的な実装用）
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// ミドルウェアを適用するパスの設定
export const config = {
  // 全てのパスに適用（除外パスは関数内で処理）
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - *.png, *.jpg, *.jpeg, *.gif, *.webp (image files)
     * - *.js, *.css (static assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|js|css|ico)).*)',
  ],
};
