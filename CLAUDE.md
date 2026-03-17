# CLAUDE.md
必ず日本語で回答してください。

## ⚠️ 最重要: Dockerコンテナ内実行の原則

**すべてのコマンドは必ずDockerコンテナ内で実行してください。**

```bash
# ✅ 正しい例（必ずこの形式で実行）
docker-compose exec rails bundle exec rubocop
docker-compose exec rails rails console
docker-compose exec next npm run dev

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

## 🚨 必須: コミット前チェック

```bash
# この順序で必ず実行
1. docker-compose exec rails bundle exec rspec      # テスト
2. docker-compose exec rails bundle exec rubocop    # Rubyリント
3. docker-compose exec next npm run lint            # JSリント
```

## コミット前の確認プロセス

1. 作業が完了したら「作業完了しました」と報告
2. ユーザーが変更内容を確認
3. ユーザーの承認を得てから `git add` を実行

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

- レビュー時は必ず日本語で回答する
- レビューには解決案も付ける
- コードレビューでは、セキュリティ・パフォーマンス・可読性を重視

## 通知音の使い分け

通知音を鳴らすのは以下の **2つのタイミングだけ**。途中経過では鳴らさないこと。

### ユーザーの承認が必要な時
```bash
afplay /System/Library/Sounds/Ping.aiff    # ピン音（確認要求）
```

### 作業が全て完了し、次のプロンプトを受け付けられる状態になった時
```bash
afplay /System/Library/Sounds/Glass.aiff   # ガラス音（完了通知）
```

**重要**: 音を鳴らすコマンドは許可不要。必ず音を鳴らしてからメッセージを表示すること。

## トークン使用量削減

- 大きなファイルは`offset`と`limit`パラメータを使用
- コードの動作説明は不要（ユーザーが要求した場合のみ）
- 複数の独立したタスクは一度に並列実行

## ルール構成

詳細なコーディング規約は `.claude/rules/` 参照（パス条件で自動ロード）。
