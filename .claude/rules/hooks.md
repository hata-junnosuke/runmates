---
paths:
  - ".claude/hooks/**"
  - ".claude/settings.json"
---

# フック（hooks）詳細

`.claude/hooks/scripts/` または `.claude/settings.json` を編集する際に自動ロードされる。

## コミット前チェック

Claude Codeでのコミット時にPreToolUseフック（`.claude/settings.json`）が自動でrspec・rubocop・npm run lint・tsc（型チェック）を実行する。
※ `npm run lint` は ESLint/Prettier のみで型チェックを含まないため、ビルドを落とす型エラー検出用に `npx tsc --noEmit` を別途実行する。
チェックが失敗した場合は原因を修正して再コミットすること。
※ 通常の端末からの `git commit` ではこのチェックは発火しない。

## 自動ガード（PreToolUse / UserPromptSubmit フック）

Claude Code実行時に `.claude/hooks/scripts/` 配下のガードが自動発火する。

| フック | タイミング | 役割 | 回避手段 |
|---|---|---|---|
| `block-destructive.sh` | Bash 実行前 | `rm -rf /` / `git push --force` / `curl \| sh` / `db:drop` などをブロック | なし（誤検知ならフック修正） |
| `secret-scan.sh` | Write/Edit/MultiEdit 前 | APIキー・秘密鍵・接続文字列の混入をブロック | 該当行に `pragma: allowlist secret` を付ける |
| `branch-guard.sh` | プロンプト送信時 | `main` 直作業や命名規則違反ブランチで警告（ブロックしない） | 命名規則に沿ったブランチに切り替える |
| `pre-commit-check.sh` | Bash 実行前（`git commit ...` のみ） | rspec/rubocop/lint/tsc を走らせ、失敗ならコミットをブロック | チェックを通す（原因修正） |

詳細は各スクリプト冒頭のコメントを参照。

> **注意**: `secret-scan.sh` はセルフトリガー回避のため `.claude/hooks/**` 配下を対象外にしている。
> このため hook スクリプト自体に秘密情報を埋め込むと検知できない（手動レビューで担保すること）。

## 新規フックスクリプトのヘッダ規約

`.claude/hooks/scripts/*.sh` を新規作成・編集する際は、必ず以下のヘッダブロックを冒頭に入れる。
`なぜ` は省略可だが、`matcher` の制約を回避するための自力判定など非自明なロジックを含むなら必ず書く。

```bash
#!/usr/bin/env bash
# <filename>.sh
# イベント: <PreToolUse|PostToolUse|UserPromptSubmit|Stop|...>(matcher: <matcher>)  ← matcher 不要なイベントは省略可
# 役割: 1〜2 行で何をするか。
# 入力: stdin に渡される JSON の構造（参照するキーだけでよい）。
# 終了コード: 0=許可 / 2=ブロック / その他は仕様に従う。
#
# なぜ: このフックを置いた背景・制約・設計判断（過去の事故、matcher の限界 など）。
```
