---
name: create-issue
description: 会話の中で議論した内容からGitHub Issueを作成し、プロジェクト「かんばん」に自動登録してStatusを設定する
user-invocable: true
disable-model-invocation: true
---

## 手順

1. **必要性の懐疑的チェック（軽量・エージェント未使用）**
   - Issue化する前に「それ、本当にいるのか？」を懐疑的に検討する。`.claude/agents/lazy-skeptic-reviewer.md` の基準（過剰実装・不要な複雑さ・既存で代替可能か・重複Issueでないか）を **インラインで自己適用** する（サブエージェントは起動しない）
   - **不要と判断した場合**: その理由と代替案を提示したうえで、AskUserQuestionで「それでもIssueを作成する／取りやめる」をユーザーに確認する
     - ユーザーが「作成する」を選んだ場合のみ次へ進む
     - 「取りやめる」を選んだ場合はここで処理を終了する
   - **必要と判断した場合**: そのまま次へ進む
2. これまでの会話の内容からIssueのタイトルと本文を作成する
   - タイトルにはIssueテンプレートに従いプレフィックスを付ける（`[Feature]` or `[Bug]`）
   - 本文には背景・現状・対応案・対象ファイルなどを含める
   - 不明点があればAskUserQuestionで確認する
3. `gh issue create` でIssueを作成する
4. 作成したIssueをプロジェクト「かんばん」に追加する:
   ```
   gh project item-add 2 --owner hata-junnosuke --url <issue-url> --format json
   ```
5. AskUserQuestionでStatusを質問する。選択肢:
   - Backlog
   - Ready
   - In progress
   - In review
   - Done
6. 回答に応じて以下のoption-idでStatusを設定する:
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
7. 完了したらIssueのURLを表示する
