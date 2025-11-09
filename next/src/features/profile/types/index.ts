// ========================================
// データモデル型定義
// ========================================

/**
 * ユーザープロフィールの型定義
 */
export interface UserProfile {
  id: number;
  email: string;
  name?: string;
  pending_email?: string;
  created_at: string;
  updated_at: string;
}

// ========================================
// APIレスポンス型定義
// ========================================

/**
 * メールアドレス変更レスポンスの型定義
 */
export interface ChangeEmailResponse {
  message: string;
  pending_email?: string;
}
