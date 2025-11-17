// クライアントサイドで使用するAPI関数

export async function signIn(email: string, password: string) {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/sign_in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      credentials: 'include', // クッキーを送受信
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (res.ok) {
      return { success: true };
    } else {
      const errorData = await res.json();
      return {
        success: false,
        error: errorData.errors?.[0] || 'ログインに失敗しました',
      };
    }
  } catch {
    return {
      success: false,
      error: 'ログインに失敗しました',
    };
  }
}

export async function signUp(
  email: string,
  password: string,
  passwordConfirmation: string,
) {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      credentials: 'include', // クッキーを送受信
      body: JSON.stringify({
        email,
        password,
        password_confirmation: passwordConfirmation,
        confirm_success_url:
          process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000/',
      }),
    });

    if (res.ok) {
      return {
        success: true,
        message: '登録が完了しました。メールを確認してください。',
      };
    } else {
      const errorData = await res.json();
      return {
        success: false,
        error: errorData.errors?.full_messages?.[0] || '登録に失敗しました',
      };
    }
  } catch {
    return {
      success: false,
      error: '登録に失敗しました',
    };
  }
}

export async function signOut() {
  try {
    await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/sign_out', {
      method: 'DELETE',
      cache: 'no-store',
      credentials: 'include', // クッキーを送受信
    });

    // ログアウト後にページをリロードして状態をリセット
    window.location.href = '/sign_in';
  } catch {
    console.error('ログアウトエラー');
    // エラーが発生してもログアウト扱いにする
    window.location.href = '/sign_in';
  }
}
