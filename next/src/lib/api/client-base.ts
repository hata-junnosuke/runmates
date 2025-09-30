/**
 * クライアントサイドAPI基本関数
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  try {
    // 本番環境ではプロキシ経由、開発環境では直接APIを呼ぶ
    const baseUrl = 
      typeof window !== 'undefined' && window.location.hostname === 'runmates.net'
        ? '/api/proxy/v1'  // プロキシ経由で同一オリジンとして扱う
        : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      credentials: 'include',  // クッキーを自動的に送信
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    return {
      success: false,
      data: {} as T,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
