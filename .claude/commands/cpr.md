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
3. `git status` と `git diff` で変更内容をユーザーに提示し、`git add` の承認を得る
   - **承認を得るまで `git add` は実行しない**
4. コミットしてPRを作成（または更新）する
   - `.github/PULL_REQUEST_TEMPLATE.md` のテンプレートに沿って本文を作成する
   - 関連Issueは `Fixes #番号` で紐付ける
   - pre-commit hookが自動でrspec/rubocop/npm run lintを実行する
   - hookが失敗した場合は原因を修正して再コミットする
5. issueの内容も更新する
6. ライブラリを追加した場合はPRに用途と使い方を記載する
