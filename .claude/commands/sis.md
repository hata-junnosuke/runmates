---
name: solve-issue
description: Issue番号を引数で受け取り、Issueを読み取ってブランチ作成→TDD実装→レビューまで自動で行う
user-invocable: true
disable-model-invocation: true
---

## 概要

GitHub Issue番号を引数として受け取り、読み取り→計画→実装→レビューまでを自動実行する。

## 引数

- `$ARGUMENTS` — Issue番号（例: `123`）

引数がない場合はAskUserQuestionでIssue番号を質問する。

## 手順

### Step 1: Issueの読み取り

```bash
gh issue view $ARGUMENTS --json title,body,labels,assignees
```

- Issueのタイトル、本文、ラベルを読み取る
- 実装に必要な要件を整理する
- 不明点があればAskUserQuestionで質問する

### Step 2: 実装計画の作成

- Issueの内容からPlanモードで実装計画を立てる
- 対象ファイル、変更内容、テスト方針を明確にする
- 計画をユーザーに提示し、承認を得てから次に進む

### Step 3: ブランチ作成

- mainブランチから新規ブランチを作成
- ブランチ命名規則に従う:
  - `[Feature]` ラベル/プレフィックス → `feature/issue-{番号}-{概要}`
  - `[Bug]` ラベル/プレフィックス → `fix/issue-{番号}-{概要}`
  - それ以外 → `refactor/issue-{番号}-{概要}`
- `{概要}` はIssueタイトルから英語のケバブケースで簡潔に付ける

```bash
git checkout main
git pull origin main
git checkout -b <branch-name>
```

### Step 4: TDD実装

CLAUDE.mdのTDDルールに従い、以下のサイクルで実装する:

1. **Red** — 先にテストを書き、失敗を確認
   ```bash
   docker-compose exec rails bundle exec rspec <spec_file>
   ```
2. **Green** — テストを通す最小限の実装を書く
3. **Refactor** — テストが通った状態でリファクタリング

フロントエンド（Next.js）の変更がある場合も同様にテストファーストで進める。

### Step 5: セルフレビュー

`/review` コマンドを実行して変更差分をレビューする。
問題があれば修正し、再度確認する。

### Step 6: 完了報告

1. 「作業完了しました」と報告する
2. ユーザーの確認・承認を待つ
3. ユーザーの承認を得てから `/cpr` でコミット・PR作成を行う

### Step 7: かんばんのStatus更新

Issueのプロジェクトステータスを「In review」に更新する:

```bash
# Issueのプロジェクトアイテムを取得
gh project item-list 2 --owner hata-junnosuke --format json | jq '.items[] | select(.content.number == <issue-number>)'
# Statusを「In review」に更新
gh project item-edit --project-id PVT_kwHOBOBFVM4A7UvN --id <item-id> --field-id PVTSSF_lAHOBOBFVM4A7UvNzgvqBtY --single-select-option-id df73e18b
```

## 注意事項

- すべてのコマンドはDockerコンテナ内で実行する（`gh`コマンドを除く）
- UI/APIに影響する変更がある場合はPlaywright MCPで動作確認を行う
