// 'use client' を付けない server-safe モジュール。
// linkClass はサーバーコンポーネントの認証ページ
// （login / create-account / forgot-password）からも import されるため、
// クライアント専用の auth-fields.tsx（'use client'）には置けない。
// 入力欄など他のスタイル定数はクライアントフォーム専用なので auth-fields.tsx に残す。
export const linkClass = 'font-semibold text-[#3B8FE3] no-underline';
