---
paths:
  - "next/**"
---

# Next.js ルール

## 基本方針
- React/Next.jsのベストプラクティスに沿って実装する。Server Components優先、パフォーマンス最適化、適切なコンポーネント分割などVercel推奨のパターンに従う

## Server Components と Client Components の使い分け
- デフォルトはServer Componentsを使用する
- `"use client"` は必要最小限のコンポーネントにだけ付ける（イベントハンドラ、useState/useEffect使用時のみ）
- データフェッチはServer Components / Server Actionsで行う。クライアント側でのfetchは避ける

## ディレクトリ構成
- `app/` はルーティングと特殊ファイルに専念（`page.tsx`, `layout.tsx`, `not-found.tsx`, `loading.tsx`, `error.tsx`, `route.ts`, `globals.css`, `favicon.ico`等）。ドメインロジックやUIコンポーネントは置かない
- ドメインロジックは `features/` にドメイン単位で集約する（`features/{domain}/components/`, `actions/`, `api/`, `types/`, `schemas/`, `lib/`）
- 共通UIコンポーネントは `components/`（`common/`, `layout/`, `ui/`）に配置。`ui/` はshadcn/uiのコンポーネント
- 共通ユーティリティは `lib/` に配置

## API呼び出しの使い分け
- サーバー側: `INTERNAL_API_URL` (host.docker.internal) を使用
- クライアント側: `NEXT_PUBLIC_API_URL` (localhost) を使用

## Chart.jsとSSR
- Chart.jsコンポーネントはSSR問題を避けるため動的インポートが必要
- `next/dynamic`で`ssr: false`オプションを指定してインポートすること

## レビュー
- Next.jsコードの変更後は必ず `vercel-react-best-practices` スキルでベストプラクティス準拠をチェックする
