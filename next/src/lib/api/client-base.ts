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
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || 
      (typeof window !== 'undefined' && 
       (window.location.hostname === 'runmates.net')
        ? 'https://backend.runmates.net/api/v1' 
        : 'http://localhost:3000/api/v1');
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      // エラーの詳細をログ出力
      if (typeof window !== 'undefined') {
        console.error('API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          url: url,
          endpoint: endpoint
        });
      }
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
