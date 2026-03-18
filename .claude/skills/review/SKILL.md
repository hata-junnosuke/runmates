---
name: review
description: git diffの変更差分を3つの観点（コード品質・セキュリティ・ベストプラクティス）で並列レビューする
user-invocable: true
disable-model-invocation: false
---

## コードレビュー

コミット前のコード変更をレビューします。

### 手順

1. `git diff` と `git diff --cached` で変更差分を取得
2. サブエージェントを3つ並列で起動し、以下の観点でレビュー
3. 結果をまとめて表示

### スキル活用

レビュー時に以下のプロジェクトスキルの知識を活用すること（`.claude/skills/` に配置済み、自動読み込み）：

- **code-review-excellence** — 全レビューの品質基準。指摘の優先度分類（blocking/important/nit）やフィードバックの書き方に活用
- **ruby-on-rails-best-practices** — Rails変更のレビュー時に参照。Basecamp流のRails規約に基づいて指摘
- **vercel-react-best-practices** — Next.js/React変更のレビュー時に参照。Vercel公式のパフォーマンス最適化パターンに基づいて指摘

### レビュー観点

#### 1. コード品質（subagent: opus）
スキル参照: `code-review-excellence`
- 可読性・命名の適切さ
- 不要なコード・デッドコードがないか
- DRY原則・適切な責務分離
- テストの網羅性（テストが必要な変更にテストがあるか）

#### 2. セキュリティ（subagent: opus）
- OWASP Top 10（SQLインジェクション、XSS、CSRF等）
- 認証・認可の適切な実装
- 機密情報の漏洩リスク（.env、credentials等）
- 入力バリデーションの漏れ
- `bundle-audit`、`brakeman`、`npm audit` 等のツールチェックも実施

#### 3. Rails/Next.js ベストプラクティス（subagent: opus）
スキル参照: `ruby-on-rails-best-practices`, `vercel-react-best-practices`
- Railsの規約に沿っているか（fat model, skinny controller等）
- Next.jsのパターンに沿っているか（Server Components, App Router等）
- N+1クエリなどパフォーマンス問題
- 既存コードのパターンとの一貫性

### 出力形式

各観点ごとに以下の形式でまとめてください：

```
## レビュー結果

### コード品質
- 🔴 問題（必ず修正）: ...
- 🟡 提案（改善推奨）: ...
- 🟢 良い点: ...

### セキュリティ
- 🔴 問題（必ず修正）: ...
- 🟡 提案（改善推奨）: ...
- 🟢 良い点: ...

### Rails/Next.js ベストプラクティス
- 🔴 問題（必ず修正）: ...
- 🟡 提案（改善推奨）: ...
- 🟢 良い点: ...

### 総合評価
問題がなければ「コミットOK」、修正が必要なら具体的な修正箇所を提示
```

### 注意事項
- 変更がない場合は「変更がありません」と表示して終了
- レビュー対象は差分のみ（変更していないコードには言及しない）
