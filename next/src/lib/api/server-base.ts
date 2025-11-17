import { unstable_noStore as noStore } from 'next/cache';

import { getAuthHeaders } from '@/features/auth/lib/headers';

type ExtendedRequestInit = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

// サーバーサイドでは内部Docker通信、クライアントサイドでは外部URLを使用
const API_BASE_URL = process.env.INTERNAL_API_URL || 'http://rails:3000/api/v1';

// APIレスポンスの型定義(ジェネリクスを使用して、型を柔軟に定義)
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; errors: string[]; status: number };

// サーバーサイドAPI呼び出し関数
export async function serverApiCall<T = unknown>(
  endpoint: string,
  options: ExtendedRequestInit = {},
): Promise<ApiResponse<T>> {
  try {
    noStore();
    const url = `${API_BASE_URL}${endpoint}`;
    const authHeaders = await getAuthHeaders();

    const defaultOptions: ExtendedRequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
      cache: 'no-store',
      next: {
        revalidate: 0,
      },
    };

    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      // 401 Unauthorized の場合は特別な処理
      if (response.status === 401) {
        console.error('Authentication failed:', {
          endpoint,
          status: response.status,
        });
      }

      // Railsからのエラーレスポンスを取得
      const errorData = await response.json().catch(() => ({ errors: [] }));

      return {
        success: false,
        errors: errorData.errors || [
          `API Error: ${response.status} ${response.statusText}`,
        ],
        status: response.status,
      };
    }

    // 204 No Content の場合
    if (response.status === 204) {
      return { success: true, data: null as T };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    // ネットワークエラーなど
    console.error('Network error:', error);
    return {
      success: false,
      errors: ['ネットワークエラーが発生しました'],
      status: 0,
    };
  }
}
