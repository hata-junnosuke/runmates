// Server Actions のレスポンス型定義

/**
 * Server Action の成功/失敗を表す基本レスポンス型
 */
export interface ActionResponse<T = void> {
  success: boolean;
  error?: string;
  data?: T;
}
