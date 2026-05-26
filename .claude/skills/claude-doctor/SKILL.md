---
name: claude-doctor
description: Claude Code の `.claude/` 構成（settings/agents/commands/hooks/skills/rules/CLAUDE.md）をAnthropic公式・参考リポと照合してベストプラクティス準拠を診断し、改善提案レポートを返す。「クロード診断」「.claude チェック」「ベストプラクティス確認」「週次レビュー」「claude-doctor」「設定見直し」などで起動。明示的に言わなくても、Claude Code 設定の健全性を気にする発話で起動する。手動で書く前に本スキルを優先。
user-invocable: true
disable-model-invocation: false
context: fork
agent: general-purpose
---

# /claude-doctor — Claude Code 構成の健康診断スキル

`.claude/` 配下の構成を **Anthropic 公式ドキュメント・参考リポ** と照合してベストプラクティス準拠をチェックし、🔴/🟡/🟢 分類で改善提案を返す週次レビュー向けスキル。

監査の詳細仕様（観点 A〜H、参照ドキュメント、出力フォーマット、必守ルール）は同梱の [`references/checklist.md`](references/checklist.md) に分離して定義してある。本 SKILL.md は薄いフロー制御に専念する（**カスタムサブエージェントには依存しない**）。

**実行モード**: `context: fork` 指定により、本スキルは起動時に自動的に **forked subagent context** で実行される。メイン会話のコンテキストは汚染されず、最終レポートだけが返る。フロー本文 (Phase 1〜5) は subagent 内で順次実行する。

**最終成果物**: カテゴリ別の監査レポート（コンソール表示） + 次週までの宿題リスト（トップ 3〜5）。

## いつ使うか

- 週次・月次の定期レビューで `.claude/` の健全性を確認したい
- 新しいフック・スキル・エージェントを導入した直後に俯瞰チェックしたい
- 「最近 Claude Code の設定追加しすぎたから整理したい」と感じたとき
- 公式の仕様アップデートに追従できているか確認したいとき

## やること（手順）

### Phase 1: スコープ確認

会話文脈で対象が明示されていない場合、AskUserQuestion で 1 回だけ確認する。デフォルトは「`.claude/` 全体」：

- 全体（settings + agents + commands + hooks + skills + rules + CLAUDE.md）
- 特定カテゴリのみ（例: 「hooks だけ」「skills だけ」）

ユーザーから何も指定がなく Auto Mode の場合はデフォルト（全体）で進める。

### Phase 2: 監査実行

本スキルは `context: fork` 指定により既に subagent context 内で実行されているため、**さらに再委譲する必要はない**。汎用 (`general-purpose`) を使うのは、CLAUDE.md・`.claude/` 配下の md 群を診断対象として読み込む必要があるため（`Explore` だと CLAUDE.md が自動ロードされず診断対象から漏れる）。fork 内で直接以下を実行する：

1. `Read` ツールで `.claude/skills/claude-doctor/references/checklist.md` を読み込む（**観点定義・分類基準・セルフチェック項目の単一情報源**）
2. checklist.md に定義された観点 A〜H を順に評価する：
   - `Glob` / `Read` で `.claude/` 配下を読む
   - `WebFetch` で Anthropic 公式 docs を **最新版で** 取得（チェックリストの「参照する一次情報」セクション参照）
   - 各指摘を checklist.md の「優先度の分類基準」に照らして 🔴 / 🟡 / 🟢 に分類し、必ず file:line と修正案を添える
3. **出力前セルフチェック**: checklist.md の「出力前セルフチェック（必須）」のチェックボックスを 1 項目ずつ自分で確認する。引っかかった項目はユーザーに出す前に該当箇所を修正する。スキップ禁止。
4. checklist.md の「出力フォーマット」セクションに従って構造化レポートを生成

**重要**: 修正は行わない（提案のみ）。絶対パス（`/Users/...`）はレポートに書かない（`$CLAUDE_PROJECT_DIR` / 相対パスを使う）。汎用エージェントで動かしている都合上、**判定基準と出力形式は checklist.md に集約**してあるので必ず Read してから評価に入ること（system prompt の暗黙ルールに頼らない）。

### Phase 3: レポート整形・提示

1. エージェントの報告をそのままユーザーに提示する（過剰な要約はしない）
2. レポート末尾に、次のアクション候補を AskUserQuestion で提示：
   - 🔴 を 1 つずつ修正する（修正対象に応じて `/sk` / `update-config` / 通常編集にバトン）
   - 🟡 をピックアップして対応
   - 今回はレポートを見るだけ・後で対応
3. ユーザーが「修正に進む」と答えたら、対象の指摘に応じて適切なスキル/コマンドへバトンする：
   - スキル追加: `/sk`
   - settings.json / hooks 周り: `update-config` スキル
   - フック実装の改善: 通常の Edit/Write
   - 既存スキルの description 改善: 直接編集 or `/sk` でリファクタ

### Phase 4: 完了報告と履歴保存（任意）

1. 今回の監査日時とスコープを簡潔に記録する（ユーザーが望む場合のみファイル化）
2. 履歴を残す場合のパス例: `.claude/tmp/audit-<YYYYMMDD>.md`（既存の `.claude/tmp/` を流用）
3. 「次回の監査は◯日後を推奨」と案内する（運用慣習：週次 or 月次）

## schedule で自動週次化したい場合

手動 `/claude-doctor` 起動だけでは続かないことがあるので、`schedule` スキルで cron 登録する選択肢を案内する：

```
/schedule
# 対話で以下を設定:
#   - 名前: claude-doctor-weekly
#   - 頻度: 週 1 回（例: 毎週月曜 9:00）
#   - 実行内容: /claude-doctor
```

注意：
- schedule で自動実行すると毎回 Claude のトークンを消費する。**忙しい時期はオフ**にできる運用にすること
- 自動実行の結果は通知だけ受け取り、対応は手動で行う（フル自動修正にしない）

## 守るルール

- すべての監査は **読み取りのみ**。修正は提案だけで、勝手にコード変更しない
- 不明点は AskUserQuestion で質問する
- 監査結果に基づく **修正は別フロー**（`/sk` / `update-config` / 通常編集）に任せる。本スキルの責務は「診断」まで
- `git add` はユーザー承認なしに実行しない
- 公式ドキュメントは仕様が更新されうるので、**監査のたびに `WebFetch` で最新を取り直す**（プロンプト経由でエージェントに指示）
- 絶対パス（`/Users/...`）をレポートに書かない（`$CLAUDE_PROJECT_DIR` / 相対パスを使う）

## 典型的なバトン先

監査レポートで指摘された問題に対して、以下のスキル/コマンドへバトンする：

| 指摘カテゴリ | バトン先 |
|---|---|
| 新しいスキルを追加すべき | `/sk` |
| 既存スキルの description 改善 | `/sk`（更新モード）or 直接編集 |
| settings.json / hooks 設定変更 | `update-config` スキル |
| フックスクリプトの実装改善 | 通常の Read → Edit |
| サブエージェントの新規追加 | `Write` で `.claude/agents/<name>.md` を作成 |
| CLAUDE.md / MEMORY.md の更新 | 直接編集 |
| 公式スキルの導入 | `/plugin install <name>@anthropic-agent-skills` の案内 |

## 典型例

### 起動例

```
/claude-doctor
```

または自然言語で：

```
.claude の構成を週次レビューしたい
ベストプラクティスチェックして
クロード診断やって
```

### 出力イメージ（抜粋・架空の指摘例。実在のバグではない）

```
## .claude 構成監査レポート（2026-05-25）

### スコープ
- 対象: .claude/ 全体
- 参照した公式ドキュメント: skills / hooks / subagents

### D. hooks/
- 🔴 .claude/hooks/scripts/secret-scan.sh:74 — `example` プレースホルダ除外で `*.example.com` ホストの実シークレットを見逃す可能性
  - 修正案: 除外語から `example` を外し、ホスト名の場合のみ別途許容
- 🟡 .claude/settings.json:13 — 既存 inline hook が相対パス。新規分は $CLAUDE_PROJECT_DIR を使用しており不揃い
  - 修正案: 既存も $CLAUDE_PROJECT_DIR に統一

### 次週までの宿題（トップ 3）
1. secret-scan.sh の example 除外問題を修正
2. settings.json のパス記法を $CLAUDE_PROJECT_DIR に統一
3. agents/*.md の description が 1 行か再確認
```

## アンチパターン

- **メイン会話で全カテゴリ監査** → コンテキストが肥大化。必ず `general-purpose` サブエージェントに委譲する
- **カスタムサブエージェントを新設して密結合する** → ホットリロード問題と「黙って古い内容で動く」リスク。詳細仕様は `references/checklist.md` に置き、汎用エージェントに展開して渡す
- **修正を勝手に実行** → 監査スキルは診断まで。修正は別フローで明示的に
- **公式ドキュメントを参照せずに「ベストプラクティス」を勝手定義** → 必ず一次情報を `WebFetch` する
- **過剰な指摘で逆に動けなくなる** → 🟡 は「改善推奨」止まり、🔴 のみ必修正。トップ 3〜5 に絞る
- **schedule で自動修正フローを組む** → 自動診断は OK だが自動修正は事故の元。提案までに留める

## 参考: 関連ドキュメント

- [`references/checklist.md`](references/checklist.md) — 監査の観点・出力フォーマット・必守ルール（本スキルが Phase 2 で読み込む）
- https://code.claude.com/docs/en/skills
- https://code.claude.com/docs/en/hooks
- https://code.claude.com/docs/en/sub-agents
- https://code.claude.com/docs/en/settings
- https://github.com/anthropics/skills
