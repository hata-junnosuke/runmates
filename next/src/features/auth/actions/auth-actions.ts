'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { clearAuthCookies, setAuthCookies } from '@/features/auth/lib/cookies';
import { forgotPasswordSchema } from '@/features/auth/schemas/auth-schemas';

const API_BASE_URL = process.env.INTERNAL_API_URL || 'http://rails:3000/api/v1';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

// 呼び出し側でフォールバックのメッセージを書かずに済むよう、
// 失敗時は必ずerrorを持つ判別可能ユニオンで返す
type AuthActionResult = { success: true } | { success: false; error: string };

// ログイン
export async function loginAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return {
        success: false,
        error: 'メールアドレスとパスワードを入力してください',
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/sign_in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // レスポンスヘッダーの認証トークンをクッキーに保存
      await setAuthCookies(response.headers);

      return { success: true };
    } else if (response.status === 429) {
      return {
        success: false,
        error:
          'リクエスト回数の制限に達しました。しばらくしてからお試しください。',
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.errors?.[0] || 'ログインに失敗しました',
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'ログインに失敗しました',
    };
  }
}

// アカウント作成
export async function createAccountAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const passwordConfirmation = formData.get('passwordConfirmation') as string;

    if (!email || !password || !passwordConfirmation) {
      return { success: false, error: '必要な情報を入力してください' };
    }

    // フロントエンドでの入力検証用の比較なのでタイミング攻撃のリスクは低い
    // eslint-disable-next-line security/detect-possible-timing-attacks
    if (password !== passwordConfirmation) {
      return { success: false, error: 'パスワードが一致しません' };
    }

    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        email,
        password,
        password_confirmation: passwordConfirmation,
        confirm_success_url:
          process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000/',
      }),
    });

    if (response.ok) {
      return {
        success: true,
        message: '登録が完了しました。メールを確認してください。',
      };
    } else if (response.status === 429) {
      return {
        success: false,
        error:
          'リクエスト回数の制限に達しました。しばらくしてからお試しください。',
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.errors?.full_messages?.[0] || '登録に失敗しました',
      };
    }
  } catch (error) {
    console.error('Create account error:', error);
    return {
      success: false,
      error: '登録に失敗しました',
    };
  }
}

// ログアウト
export async function logoutAction() {
  try {
    const cookieStore = await cookies();

    // 認証情報を取得
    const accessToken = cookieStore.get('access-token')?.value;
    const client = cookieStore.get('client')?.value;
    const uid = cookieStore.get('uid')?.value;

    // Rails APIにサインアウトリクエストを送信
    if (accessToken && client && uid) {
      await fetch(`${API_BASE_URL}/auth/sign_out`, {
        method: 'DELETE',
        headers: {
          'access-token': accessToken,
          client: client,
          uid: uid,
        },
        cache: 'no-store',
      });
    }

    // 認証クッキーを削除（発行・削除はNext.jsの責務）
    await clearAuthCookies();
  } catch (error) {
    console.error('Sign out error:', error);
    // エラーが発生してもクッキーはクリアする
    await clearAuthCookies();
  }

  // LPへリダイレクト
  redirect('/');
}

// パスワードリセットメールの送信依頼
export async function forgotPasswordAction(
  email: string,
): Promise<AuthActionResult> {
  const parsed = forgotPasswordSchema.safeParse({ email });
  if (!parsed.success) {
    return {
      success: false,
      error: '有効なメールアドレスを入力してください',
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        email: parsed.data.email,
        redirect_url: `${BASE_URL}/reset-password`,
      }),
    });

    if (response.status === 429) {
      return {
        success: false,
        error:
          'リクエスト回数の制限に達しました。しばらくしてからお試しください。',
      };
    }

    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true };
    }

    return {
      success: false,
      error:
        data.errors?.full_messages?.join(' ') ||
        data.errors?.[0] ||
        'メールの送信に失敗しました。',
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    return { success: false, error: 'ネットワークエラーが発生しました。' };
  }
}

// メールアドレス確認（サインアップ時の確認リンク）
export async function confirmEmailAction(
  token: string,
): Promise<AuthActionResult> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/confirmation?confirmation_token=${encodeURIComponent(token)}`,
      { method: 'GET', cache: 'no-store' },
    );

    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true };
    }

    return {
      success: false,
      error:
        data.errors?.join(' ') ||
        '確認に失敗しました。リンクの有効期限が切れている可能性があります。',
    };
  } catch (error) {
    console.error('Confirm email error:', error);
    return { success: false, error: 'ネットワークエラーが発生しました。' };
  }
}

// パスワードリセット（成功時はそのままログイン状態にする）
export async function resetPasswordAction({
  token,
  password,
  passwordConfirmation,
}: {
  token: string;
  password: string;
  passwordConfirmation: string;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        password,
        password_confirmation: passwordConfirmation,
        reset_password_token: token,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      await setAuthCookies(response.headers);
      return { success: true };
    }

    return {
      success: false,
      error:
        data.errors?.[0] ||
        'パスワードのリセットに失敗しました。リンクの有効期限が切れている可能性があります。',
    };
  } catch (error) {
    console.error('Reset password error:', error);
    return { success: false, error: 'ネットワークエラーが発生しました。' };
  }
}
