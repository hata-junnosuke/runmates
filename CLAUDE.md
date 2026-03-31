# CLAUDE.md
必ず日本語で回答してください。
あいまいな点や不明点があれば、AskUserQuestionツールを使って質問してください。

## ⚠️ 最重要: Dockerコンテナ内実行の原則

**すべてのコマンドは必ずDockerコンテナ内で実行してください。**

```bash
# ✅ 正しい例（必ずこの形式で実行）
docker compose exec rails bundle exec rubocop
docker compose exec rails rails console
docker compose exec next npm run dev

# ❌ 間違った例（絶対に実行しない）
bundle exec rubocop  # ローカル実行
rails console       # ローカル実行
npm run dev        # ローカル実行
```

**例外（ローカル実行OK）:**
- `gh` コマンド: Runmatesリポジトリ直下から直接実行（コンテナ不要）
- `terraform` コマンド: `terraform/envs/prod` ディレクトリでローカル実行

## ブランチ命名規則

```
main              # 本番環境（保護ブランチ）
├── feature/*     # 新機能開発
├── fix/*         # バグ修正
├── refactor/*    # リファクタリング
```

**重要:** この3種類のみ使用。`chore/*` や `docs/*` は使わない。

## TDD（テスト駆動開発）

Rails機能の開発はTDDで行う。

1. **Red** — 先にRSpecテストを書き、失敗を確認する
2. **Green** — テストを通す最小限の実装を書く
3. **Refactor** — テストが通った状態でリファクタリングする

## コミット前チェック

Claude Codeでのコミット時にPreToolUseフック（`.claude/settings.json`）が自動でrspec・rubocop・npm run lintを実行する。
チェックが失敗した場合は原因を修正して再コミットすること。
※ 通常の端末からの `git commit` ではこのチェックは発火しない。

## Playwright MCPによる動作確認

実装完了後、UI/APIに影響する変更がある場合はPlaywright MCPで動作確認を行う。

- テストアカウント: `test@example.com` / `password123`（`rails db:seed`で作成）
- 対象: フォーム送信、画面遷移、エラー表示など、ユーザー操作に関わる変更
- **確認が終わったら必ず `browser_close` でブラウザを閉じること**

## 実装後のチェックフロー

1. リント・テストを実行して通ることを確認（`rubocop`、`rspec`、`npm run lint`）
2. `/rev` でセルフレビュー（必要性チェック含む）
3. 「作業完了しました」と報告
4. ユーザーの承認を得てから `git add` を実行

## Rubocopへの対応方針

Rubocopで検出されたすべての違反に対応すること。対応方法の優先順位：
1. **コードの改善で対応** - 可能な限りコードを改善して違反を解消
2. **rubocop:disable コメントで無効化** - コード改善が困難な場合のみ使用
3. **設定ファイルでの除外は最終手段** - .rubocop.ymlへの除外追加は避ける

## Issue/PRテンプレート

- **バグレポート**: `.github/ISSUE_TEMPLATE/bug_report.md` - `[Bug]` プレフィックス
- **機能要望**: `.github/ISSUE_TEMPLATE/feature_request.md` - `[Feature]` プレフィックス
- **PR**: `.github/PULL_REQUEST_TEMPLATE.md` - 関連Issueを `Fixes #番号` で紐付け

## GitHub CLI

- `gh`コマンドでコメントを付与するときはマークダウン形式で作成すること
- 認証: 環境変数 `GH_TOKEN`（最優先）、keyring/キーチェーン（推奨）
- トークン期限切れ時: `gh auth logout` → `gh auth login` でブラウザ認証

## レビュールール

- レビューには解決案も付ける
- コードレビューでは、セキュリティ・パフォーマンス・可読性を重視

## トークン使用量削減

- 大きなファイルは`offset`と`limit`パラメータを使用
- コードの動作説明は不要（ユーザーが要求した場合のみ）
- 複数の独立したタスクは一度に並列実行

## ルール構成

詳細なコーディング規約は `.claude/rules/` 参照（パス条件で自動ロード）。
