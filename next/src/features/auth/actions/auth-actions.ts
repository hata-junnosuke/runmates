'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_BASE_URL = process.env.INTERNAL_API_URL || 'http://rails:3000/api/v1';

// サインイン
export async function signInAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { success: false, error: 'メールアドレスとパスワードを入力してください' };
    }

    const response = await fetch(`${API_BASE_URL}/auth/sign_in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // レスポンスヘッダーから認証トークンを取得
      const accessToken = response.headers.get('access-token');
      const client = response.headers.get('client');
      const uid = response.headers.get('uid');

      if (accessToken && client && uid) {
        // クッキーに認証情報を保存
        const cookieStore = await cookies();
        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
          path: '/',
        };

        cookieStore.set('access-token', accessToken, cookieOptions);
        cookieStore.set('client', client, cookieOptions);
        cookieStore.set('uid', uid, cookieOptions);
      }

      return { success: true };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.errors?.[0] || 'ログインに失敗しました',
      };
    }
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: 'ログインに失敗しました',
    };
  }
}

// サインアップ
export async function signUpAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const passwordConfirmation = formData.get('passwordConfirmation') as string;

    if (!email || !password || !passwordConfirmation) {
      return { success: false, error: '必要な情報を入力してください' };
    }

    if (password !== passwordConfirmation) {
      return { success: false, error: 'パスワードが一致しません' };
    }

    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        password_confirmation: passwordConfirmation,
        confirm_success_url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000/',
      }),
    });

    if (response.ok) {
      return {
        success: true,
        message: '登録が完了しました。メールを確認してください。',
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.errors?.full_messages?.[0] || '登録に失敗しました',
      };
    }
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: '登録に失敗しました',
    };
  }
}

// サインアウト
export async function signOutAction() {
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
          'client': client,
          'uid': uid,
        },
      });
    }

    // Next.js側でもクッキーをクリア（開発環境での確実な削除のため）
    cookieStore.delete('access-token');
    cookieStore.delete('client');
    cookieStore.delete('uid');
  } catch (error) {
    console.error('Sign out error:', error);
    // エラーが発生してもクッキーはクリアする
    const cookieStore = await cookies();
    cookieStore.delete('access-token');
    cookieStore.delete('client');
    cookieStore.delete('uid');
  }

  // サインインページへリダイレクト
  redirect('/sign_in');
}