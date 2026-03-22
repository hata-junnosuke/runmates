---
name: create-issue
description: 会話の中で議論した内容からGitHub Issueを作成し、プロジェクト「かんばん」に自動登録してStatusを設定する
user-invocable: true
disable-model-invocation: true
---

## 手順

1. これまでの会話の内容からIssueのタイトルと本文を作成する
   - タイトルにはIssueテンプレートに従いプレフィックスを付ける（`[Feature]` or `[Bug]`）
   - 本文には背景・現状・対応案・対象ファイルなどを含める
   - 不明点があればAskUserQuestionで確認する
2. `gh issue create` でIssueを作成する
3. 作成したIssueをプロジェクト「かんばん」に追加する:
   ```
   gh project item-add 2 --owner hata-junnosuke --url <issue-url> --format json
   ```
4. AskUserQuestionでStatusを質問する。選択肢:
   - Backlog
   - Ready
   - In progress
   - In review
   - Done
5. 回答に応じて以下のoption-idでStatusを設定する:
   ```
   gh project item-edit --project-id PVT_kwHOBOBFVM4A7UvN --id <item-id> --field-id PVTSSF_lAHOBOBFVM4A7UvNzgvqBtY --single-select-option-id <option-id>
   ```
   | Status | option-id |
   |--------|-----------|
   | Backlog | f75ad846 |
   | Ready | 61e4505c |
   | In progress | 47fc9ee4 |
   | In review | df73e18b |
   | Done | 98236657 |
6. 完了したらIssueのURLを表示する
