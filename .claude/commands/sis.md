---
name: solve-issue
description: Issue番号を引数で受け取り、Issueを読み取ってブランチ作成→TDD実装→レビューまで自動で行う
user-invocable: true
disable-model-invocation: true
---

## 引数

- `$ARGUMENTS` — Issue番号（例: `123`）。数値であること。
- 引数がない場合はAskUserQuestionでIssue番号を質問する。

## 手順

1. **Issue読み取り**: `gh issue view $ARGUMENTS --json title,body,labels,assignees` で要件を整理。不明点はAskUserQuestionで質問
2. **実装計画**: Planモードで計画を立て、ユーザーの承認を得る
3. **ブランチ作成**: mainから新規ブランチを作成（CLAUDE.mdの命名規則に従う）
   - `[Feature]` → `feature/issue-{番号}-{概要}`
   - `[Bug]` → `fix/issue-{番号}-{概要}`
   - それ以外 → `refactor/issue-{番号}-{概要}`
4. **TDD実装**: CLAUDE.mdのTDDルールに従う（Red → Green → Refactor）
5. **実装後チェック**: CLAUDE.mdの「実装後のチェックフロー」に従う
6. **動作確認**: フロント（Next.js）の変更がある場合は、Playwright MCPで動作確認を行う（CLAUDE.mdのPlaywright MCP手順に従う）
7. **完了報告**: 「作業完了しました」と報告し、ユーザーの承認後に `/cpr` でPR作成
8. **かんばん更新**: `gh project item-list` と `gh project item-edit` でIssueのステータスを「In review」に更新（プロジェクトIDは `gh project list --owner hata-junnosuke` で動的に取得する）
