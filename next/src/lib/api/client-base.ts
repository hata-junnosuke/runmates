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
    // 環境変数を無視して直接URLを指定
    const baseUrl =
      typeof window !== 'undefined' && window.location.hostname === 'runmates.net'
        ? 'https://backend.runmates.net/api/v1' 
        : 'http://localhost:3000/api/v1';
    const url = `${baseUrl}${endpoint}`;

    // デバッグログ
    if (typeof window !== 'undefined') {
      console.log('🔍 API Request Debug:');
      console.log('  Hostname:', window.location.hostname);
      console.log('  Base URL:', baseUrl);
      console.log('  Full URL:', url);
      console.log('  Credentials:', 'include');
    }

    const response = await fetch(url, {
      ...options,
      credentials: 'include',
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
