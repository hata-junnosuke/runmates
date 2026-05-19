---
name: review
description: git diffの変更差分を evaluator エージェントで総合レビューする（コード品質・セキュリティ・ベストプラクティス・必要性）
user-invocable: true
disable-model-invocation: false
---

## コードレビュー

コミット前のコード変更を、作成済みの `evaluator` エージェントに委譲して総合レビューします。

### 手順

1. `git diff` と `git diff --cached` で変更差分を取得する
2. 変更がなければ「変更がありません」と表示して終了する
3. 変更がある場合、`evaluator` エージェント（`subagent_type: evaluator`）を1つ起動する。
   プロンプトには必ず以下を含めること:
   - **仕様書なしモード**であること（受け入れ基準の検証はスキップし、`git diff`/`git diff --cached` の差分のみを対象にレビューする）
   - 変更ファイル一覧と、差分の確認方法（`git -C <repo> diff` 等）
   - 活用すべきスキル（下記「スキル活用」）
   - 出力は下記「出力形式」に従うこと
   - 問題は報告のみで自分では修正しないこと（evaluator の既定ルール）
4. evaluator の報告をそのままユーザーに提示する

### スキル活用

evaluator に以下のプロジェクトスキルの知識を活用するよう指示すること（`.claude/skills/` に配置済み）：

- **code-review-excellence** — 全レビューの品質基準。指摘の優先度分類やフィードバックの書き方
- **ruby-on-rails-best-practices** — Rails変更時。Basecamp流のRails規約
- **vercel-react-best-practices** — Next.js/React変更時。Vercel公式のパフォーマンスパターン

### レビュー観点（evaluator に指示する観点）

evaluator は必要性チェック（lazy-skeptic 基準を自己適用）とテスト/リント実行も担う。以下4観点で評価させる:

1. **コード品質** — `code-review-excellence` の基準
2. **セキュリティ** — `code-review-excellence` のSecurityチェックリスト＋必要に応じ `bundle-audit`/`brakeman`/`npm audit`
3. **Rails/Next.js ベストプラクティス** — 対応する best-practices スキル
4. **必要性チェック** — `lazy-skeptic-reviewer.md` の基準を evaluator 自身が適用（入れ子起動しない）

### 出力形式

evaluator に以下の形式で報告させること：

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

- **重要**: レビューは必ず `Agent` ツールの `subagent_type` に `evaluator` を指定して起動すること。`general-purpose` で代用しないこと（色分け・モデル指定が効かなくなる）。
- 変更がない場合は「変更がありません」と表示して終了
- レビュー対象は差分のみ（変更していないコードには言及しない）
