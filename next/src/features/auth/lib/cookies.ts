// ⚠️ このファイルに 'use server' を付けないこと（認証バイパスになる）
//
// 'use server' を付けたファイルのexportは、Next.jsによってHTTPエンドポイントに変換され、
// 外部から直接呼び出せるようになる（呼び出しに必要なIDはクライアントのJSバンドルに
// 埋め込まれるため、攻撃者はcurlでも叩ける）。
//
// setAuthCookies は渡された値を検証せずそのままCookieに書く関数なので、公開されると
// 攻撃者が自分のトークンを他人のブラウザに書き込めてしまう（セッション固定攻撃）。
// TypeScriptの Headers 型は防御にならない。型は実行時に消えるうえ、この関数が使うのは
// .get() だけで、Server Actionの引数としてシリアライズ可能な Map でも代用できるため。
//
// 呼び出し元の auth-actions.ts / delete-account-action.ts 側が 'use server' なので、
// このファイルは通常のサーバーモジュールのままでよい。
import { cookies } from 'next/headers';

const AUTH_COOKIE_NAMES = ['access-token', 'client', 'uid'] as const;

const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

/**
 * Rails のレスポンスヘッダーから認証3点セットを取り出しCookieに保存する。
 * 3つ揃っていない場合はCookieを一切書き換えず、サーバーログに記録する。
 */
export async function setAuthCookies(headers: Headers): Promise<void> {
  const accessToken = headers.get('access-token');
  const client = headers.get('client');
  const uid = headers.get('uid');

  if (!accessToken || !client || !uid) {
    console.error(
      'setAuthCookies: 認証ヘッダー（access-token / client / uid）が揃っていません',
    );
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set('access-token', accessToken, authCookieOptions);
  cookieStore.set('client', client, authCookieOptions);
  cookieStore.set('uid', uid, authCookieOptions);
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  for (const name of AUTH_COOKIE_NAMES) {
    cookieStore.delete(name);
  }
}
