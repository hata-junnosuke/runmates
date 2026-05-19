---
name: create-pull-request
description: mainブランチチェック後、コミット・PR作成まで自動で行う
user-invocable: true
disable-model-invocation: true
---

## 手順

1. 現在のブランチを確認する
   - **mainブランチの場合**: AskUserQuestionでブランチを作成するか確認する
     - 作成する場合: ブランチ名をAskUserQuestionで質問し、新規ブランチを作成してから続行
     - 作成しない場合: 処理を中止する
   - **main以外のブランチの場合**: そのまま続行
2. 現在のブランチで既存のPRがあるか `gh pr list --head <ブランチ名>` で確認する
   - **既存PRがある場合**: AskUserQuestionで「既存PR #XXX を更新しますか？それとも新規PRを作成しますか？」と確認する
     - 更新する場合: コミット・プッシュ後、`gh pr edit` でPRのタイトル・本文を更新する
     - 新規作成する場合: 通常のPR作成フローに進む
   - **既存PRがない場合**: 新規PR作成フローに進む
3. **コードレビュー（evaluator エージェント）**
   - **重要**: `git diff` / `git diff --cached` に変更がある場合、`Agent` ツールの `subagent_type` に `evaluator` を指定して起動すること。`general-purpose` で代用しないこと（色分け・モデル指定が効かなくなる）。
   - プロンプトには **仕様書なしモード**であること・差分の確認方法・活用スキル（code-review-excellence / ruby-on-rails-best-practices / vercel-react-best-practices）・`/rev` と同じ4観点の出力形式を渡す
   - evaluator の報告をそのままユーザーに提示する
   - **🔴（必ず修正）が1件以上ある場合**: その旨を明示し処理を中断する。AskUserQuestionで「修正する／このまま続行する」を確認し、修正を選んだら指摘対応後にこのステップから再実行する
   - 🔴 がなければ次へ進む
   - 変更がない場合はレビューをスキップ
4. `git status` と `git diff` で変更内容をユーザーに提示し、`git add` の承認を得る
   - **承認を得るまで `git add` は実行しない**
5. コミットしてPRを作成（または更新）する
   - `.github/PULL_REQUEST_TEMPLATE.md` のテンプレートに沿って本文を作成する
   - 関連Issueは `Fixes #番号` で紐付ける
   - pre-commit hookが自動でrspec/rubocop/npm run lintを実行する
   - hookが失敗した場合は原因を修正して再コミットする
6. issueの内容も更新する
7. ライブラリを追加した場合はPRに用途と使い方を記載する
