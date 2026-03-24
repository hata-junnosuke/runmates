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
2. コミットしてPRを作成する
   - pre-commit hookが自動でrspec/rubocop/npm run lintを実行する
   - hookが失敗した場合は原因を修正して再コミットする
3. issueの内容も更新する
4. ライブラリを追加した場合はPRに用途と使い方を記載する
