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
    // 本番環境の場合は直接backend.runmates.netを使用
    const baseUrl = 
      typeof window !== 'undefined' && window.location.hostname === 'runmates.net'
        ? 'https://backend.runmates.net/api/v1'
        : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
    const url = `${baseUrl}${endpoint}`;

    // クッキーから認証情報を取得してヘッダーに設定
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // optionsのheadersが存在する場合はマージ
    if (options?.headers) {
      const optHeaders = options.headers as Record<string, string>;
      Object.assign(headers, optHeaders);
    }
    
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split('; ');
      const accessToken = cookies.find(c => c.startsWith('access-token='))?.split('=')[1];
      const client = cookies.find(c => c.startsWith('client='))?.split('=')[1];
      const uid = cookies.find(c => c.startsWith('uid='))?.split('=')[1];
      
      if (accessToken && client && uid) {
        headers['access-token'] = decodeURIComponent(accessToken);
        headers['client'] = decodeURIComponent(client);
        headers['uid'] = decodeURIComponent(uid);
      }
    }

    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers,
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
