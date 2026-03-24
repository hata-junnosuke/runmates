---
name: review
description: git diffの変更差分を4つの観点（コード品質・セキュリティ・ベストプラクティス・必要性）で並列レビューする
user-invocable: true
disable-model-invocation: false
---

## コードレビュー

コミット前のコード変更をレビューします。

### 手順

1. `git diff` と `git diff --cached` で変更差分を取得
2. サブエージェントを4つ並列で起動し、以下の観点でレビュー
3. 結果をまとめて表示

### スキル活用

レビュー時に以下のプロジェクトスキルの知識を活用すること（`.claude/skills/` に配置済み、自動読み込み）：

- **code-review-excellence** — 全レビューの品質基準。指摘の優先度分類（blocking/important/nit）やフィードバックの書き方に活用
- **ruby-on-rails-best-practices** — Rails変更のレビュー時に参照。Basecamp流のRails規約に基づいて指摘
- **vercel-react-best-practices** — Next.js/React変更のレビュー時に参照。Vercel公式のパフォーマンス最適化パターンに基づいて指摘

### レビュー観点

#### 1. コード品質（subagent: opus）
`code-review-excellence` スキルの基準に従ってレビュー

#### 2. セキュリティ（subagent: opus）
`code-review-excellence` スキルのSecurityチェックリストに従い、`bundle-audit`、`brakeman`、`npm audit` 等のツールチェックも実施

#### 3. Rails/Next.js ベストプラクティス（subagent: opus）
`ruby-on-rails-best-practices`、`vercel-react-best-practices` スキルの基準に従ってレビュー

#### 4. 必要性チェック（subagent: lazy-skeptic-reviewer）
変更の必要性を懐疑的に検証する:
- この変更は本当に必要か？既存コードで代替できないか？
- 過剰な実装・不要な複雑さはないか？
- 新しいファイル・依存関係は本当に必要か？

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

### 必要性チェック
- 🔴 不要（削除推奨）: ...
- 🟡 疑問（要検討）: ...
- 🟢 妥当: ...

### 総合評価
問題がなければ「コミットOK」、修正が必要なら具体的な修正箇所を提示
```

### 注意事項
- 変更がない場合は「変更がありません」と表示して終了
- レビュー対象は差分のみ（変更していないコードには言及しない）
