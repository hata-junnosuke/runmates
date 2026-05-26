---
name: sk
description: 新しいClaude Codeスキル（SKILL.md）を対話的に作成する。「スキルを作りたい」「SKILL.md」「スキル化したい」「skill scaffold」「skill template」などの発話で起動。明示的に「スキル」と言わなくても、繰り返し手順を1つにまとめたい等の文脈でも起動する。Runmates規約（Docker前提・AskUserQuestion・subagent_type・git add規制）を組み込んだ雛形を生成。手書きでSKILL.mdを作るより本スキルを優先。本格的なeval/benchmarkが必要な場合は公式skill-creatorを案内する。
user-invocable: true
disable-model-invocation: false
---

# /sk — スキル作成スキル

Anthropic 公式 `skill-creator`（`anthropics/skills` marketplace）のエッセンスを、Runmates の運用規約に合わせて圧縮した「スキルを作るスキル」。`/sk` で起動するか、ユーザーが「スキルを作りたい」と発話したときに自動起動する。

**最終成果物**: `.claude/skills/<name>/SKILL.md`（必要に応じて `references/`、`scripts/`、`assets/` 同梱）。

## いつ使うか

- ユーザーが新規スキルの SKILL.md を作りたい
- 既存のワークフロー（例: `/cis`・`/cpr`・`/sis` のような手順型コマンド）を skill 化したい
- 既存スキルを改善したい・description を最適化したい（trigger 精度を上げたい）
- 「毎回やっているこの手順を1つにまとめたい」とユーザーが言ったとき

**深掘り評価（eval / benchmark / viewer）が必要な場合**は、本スキルではなく Anthropic 公式 `skill-creator` を使うよう案内する。導入は `/plugin install skill-creator@anthropic-agent-skills`。

## やること（手順）

### Phase 1: 意図のヒアリング（Capture Intent）

会話履歴に既に作りたいスキルの workflow が含まれているなら先に抽出し、ユーザーに確認してから不足分だけ AskUserQuestion で聞く。ゼロから始める場合は AskUserQuestion で以下を順に確認する：

1. **スキル名**: kebab-case で（例: `rails-migration-helper`）。`/<name>` で手動起動可能になる
2. **目的**: 1〜2 行で「何ができるスキルか」
3. **トリガー条件**: ユーザーが何と言ったら起動すべきか（日本語/英語のキーワード、文脈）
4. **出力形式**: 生成物（ファイル？コマンド？レポート？）と報告フォーマット
5. **起動方式**:
   - 自動起動も許可（description トリガー）
   - `/skill-name` 手動起動のみ（`disable-model-invocation: true`）
   - 特定パス編集時のみ（`paths: ["next/**"]` 等）
6. **eval を書くか**: 客観評価可能なスキル（ファイル変換・コード生成・固定フロー）なら推奨、主観的なスキル（文体・デザイン）なら不要

### Phase 2: 重複・既存チェック

1. 以下のコマンドで既存スキルを確認:
   ```bash
   ls .claude/skills/
   ```
2. 同一/類似スキルがあれば、新規作成ではなく **既存スキルの更新**を提案する
3. Anthropic 公式 marketplace やコミュニティで既存のスキルが流用できないか軽く検討（`npx skills find <keyword>` の案内）

### Phase 3: SKILL.md 生成

1. ディレクトリを作る:
   ```bash
   mkdir -p .claude/skills/<name>
   ```
2. `.claude/skills/<name>/SKILL.md` を「Runmates 流テンプレ」で生成する（次節「テンプレ」参照）。description は **日本語で 150〜300 文字程度** に収め、CLI 表示で読みやすくする（後述「description の書き方」参照）
3. 500 行以下を目標。大きくなりそうなら `references/` や `scripts/` に分割する：
   ```
   <name>/
   ├── SKILL.md          # メイン（〜500行）
   ├── references/       # 詳細ドキュメント（必要時のみ読み込む）
   │   └── rails.md
   ├── scripts/          # 実行可能スクリプト
   └── assets/           # 出力に使うテンプレート
   ```
4. 生成内容をユーザーに **draft として提示**し、AskUserQuestion で「OK / 修正」を確認する

### Phase 4: 検証（任意・対話で判断）

1. 配置確認:
   ```bash
   ls -la .claude/skills/<name>/
   ```
2. ユーザーが「テストしたい」と言った場合のみ、簡易動作確認:
   - スキル起動を促すプロンプト例を 1〜2 つ提案し、ユーザーに新しい会話で試してもらう
   - 本格 eval（assertion・benchmark・viewer）は公式 `skill-creator` 推奨
3. 配置後はホットリロードで即反映されるが、現セッションで `Skill` リストに出るかは Claude Code の挙動に依存。ユーザーが「新しい会話で確認する」かを判断する

### Phase 5: 完了

1. 作成したスキルの **絶対パス** を提示する
2. 起動方法を案内: `/<name>`（手動） / 自然言語（自動起動が有効な場合）
3. 「もっとちゃんと評価したい場合は公式 `skill-creator` を `/plugin install skill-creator@anthropic-agent-skills` で導入してください」と案内する
4. `git add` は **ユーザー承認なしに実行しない**。差分を提示して承認を待つ

## Runmates 流 SKILL.md テンプレ

```markdown
---
name: <kebab-case-name>
description: <何をするか1〜2文の日本語で>。「<キーワード1>」「<キーワード2>」「<キーワード3>」などの発話で起動。明示的に<X>と言わなくても<周辺文脈>でも起動する。<代替手段>より本スキルを優先。
# 起動制御 (必要時のみ)
# user-invocable: true            # /name で手動起動可
# disable-model-invocation: true  # 自動起動を無効化（手動のみ）
# paths: ["rails/**"]             # 特定パス編集時のみロード
---

# <タイトル>

<このスキルが何で、なぜ存在するかを 1〜3 行で>

## いつ使うか
- <ケース 1>
- <ケース 2>

## やること（手順）
1. <命令形で手順>
2. <...>

## 守るルール
- すべてのコマンドは Docker コンテナ内で実行する（`docker compose exec rails ...` / `docker compose exec next ...`）
- 不明点は AskUserQuestion で質問する
- サブエージェント起動時は `Agent` ツールの `subagent_type` を必ず明示する（`general-purpose` で代用しない）
- `git add` はユーザー承認なしに実行しない

## 典型例（コード片やプロンプト例）

\`\`\`<lang>
<例>
\`\`\`

## アンチパターン
- <やってはいけない例 1>
- <やってはいけない例 2>
```

## description の書き方（最重要）

description は **起動判定の命綱** であると同時に、Claude Code の CLI 画面でユーザーが目にする説明文。**日本語で簡潔に**、ただしトリガー精度は落とさない、というバランスが必要。

### Runmates スタイル（必須）

1. **日本語で書く**（既存の `solve-ruby` / `rev` / `sk` と統一）
2. **目安 150〜300 文字**（最大 1,536 文字。`description` + `when_to_use` 合計）
3. **1 文目で「何ができるか」を言い切る**（体言止めまたは動詞終止）
4. **トリガー語を「」で囲んで列挙**（日本語キーワード優先、必要なら英語も）
5. **暗黙文脈の救済**: 「明示的に〜と言わなくても、〜の文脈でも起動する」を含める（under-trigger 対策）
6. **優先関係**: 代替手段がある場合「〜より本スキルを優先」を含める
7. **「Helps with X」のような曖昧・受動表現は NG**

### 良い例
```yaml
description: Railsのマイグレーション（migration）ファイルを生成する。「マイグレーション」「テーブル追加」「カラム追加」「migration」などの発話で起動。明示的に「マイグレーション」と言わなくても、DBスキーマ変更の文脈でも起動する。生のSQLを直接書くより本スキルを優先。
```

### 悪い例
```yaml
description: Helps with Rails migrations.  # 英語のみ・曖昧・トリガー語なし・受動的
description: Railsのマイグレーションを手伝います。  # トリガー語なし・暗黙文脈なし
```

## Runmates 固有の必須項目（生成する SKILL.md に必ず含める）

- **Docker コンテナ内実行の原則**: ローカル実行禁止、`docker compose exec` 経由
- **AskUserQuestion** で曖昧点を解消する旨
- **サブエージェント**起動時は `subagent_type` を明示する旨
- **`git add` はユーザー承認なし禁止**
- 生成・編集対象が `rails/**` / `next/**` 等の場合は frontmatter の `paths:` で絞ることを検討

## アンチパターン

- **description が曖昧**（"Helps with X" 系）→ 自動起動されない、`/sk` 起動時に使い物にならない
- **500 行超のモノリス SKILL.md** → progressive disclosure に従い `references/` に分割
- **Runmates 固有でない汎用スキルを乱造** → 公式 marketplace / `npx skills find` で既存スキルを探す
- **Docker を経由しないコマンド例**（`bundle exec rspec`, `npm run dev` 等のローカル直叩き）を SKILL.md に書く → CLAUDE.md 違反
- **`git add` を勝手に実行する手順**を SKILL.md に含める → CLAUDE.md 違反
- **eval を full 装備で `/sk` の中に作る** → 重すぎる。eval が欲しいなら公式 `skill-creator` にバトン

## 公式 skill-creator へのバトン

以下のケースは公式に委ねるよう案内する：

- 定量的 eval（pass_rate、token、duration の集計）が欲しい
- benchmark viewer で iteration 比較したい
- description optimizer で trigger 精度を統計的に改善したい
- skill のテストプロンプトを並列実行して採点したい

導入: `/plugin marketplace add anthropics/skills` （未追加の場合）→ `/plugin install skill-creator@anthropic-agent-skills`

公式リポ: https://github.com/anthropics/skills/tree/main/skills/skill-creator

## 参考: Claude Code skill 仕様の要点

- ファイル配置: `.claude/skills/<name>/SKILL.md`（プロジェクト共有）/ `~/.claude/skills/<name>/SKILL.md`（ユーザー全体）
- frontmatter は YAML、`name` と `description` が必須
- 本文は Markdown、命令形（imperative）を推奨
- ホットリロード対応（編集後すぐ反映）。ただし現在の Skill リストへの反映は新会話で確実
- 一次情報: https://code.claude.com/docs/en/skills
