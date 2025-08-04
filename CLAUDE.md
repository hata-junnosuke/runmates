# CLAUDE.md
必ず日本語で回答してください。
このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

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

## アーキテクチャ概要

これは、Rails APIバックエンドとNext.jsフロントエンドを持つフルスタックの「Runmates」ランニング管理アプリケーションで、Dockerでコンテナ化されています。ランニング記録の追跡、目標設定、データ可視化機能を提供します。

**技術スタック:**
- **バックエンド**: Rails API (Ruby 3.4.3) + MySQL 8.0.32
- **フロントエンド**: Next.js 15.3.1 + TypeScript、Tailwind CSS、MUI、Chart.js
- **認証**: DeviseTokenAuth（HTTP-onlyクッキー使用）
- **データ可視化**: Chart.js + react-chartjs-2
- **デプロイ**: AWS ECS Fargate + Nginxリバースプロキシ

**主要機能:**
- カレンダーインターフェースによるランニング記録管理
- 月次・年次目標の設定と追跡
- インタラクティブなデータ可視化と進捗チャート
- モダンなデザインパターンによるレスポンシブUI

## 開発セットアップとコマンド

### 初期セットアップ
```bash
# コンテナのクローンとビルド
docker compose build --no-cache
docker compose up

# フロントエンドのセットアップ（新しいターミナルで）
docker compose exec next /bin/bash
npm i
npm run dev  # localhost:8000で起動

# バックエンドのセットアップ（新しいターミナルで）
docker compose run --rm rails bundle install
docker compose exec rails /bin/bash
rails s -b '0.0.0.0'  # localhost:3000で起動
```

### 日常的な開発コマンド

```bash
# フロントエンド (Next.js)
docker-compose exec next npm run dev          # 開発サーバー
docker-compose exec next npm run build        # プロダクションビルド
docker-compose exec next npm run lint         # ESLintチェック
docker-compose exec next npm run format       # リントの自動修正

# バックエンド (Rails)
docker-compose exec rails rails s -b '0.0.0.0' # サーバー起動
docker-compose exec rails rails console        # 対話型コンソール
docker-compose exec rails rails db:migrate     # マイグレーション実行

# テスト
docker-compose exec rails bundle exec rspec    # 全テスト実行
docker-compose exec rails bundle exec rspec spec/models/  # 特定ディレクトリ
docker-compose exec rails bundle exec rspec --format documentation  # 詳細表示

# コード品質
docker-compose exec rails bundle exec rubocop  # Rubyリント
docker-compose exec rails bundle exec rubocop -a  # 自動修正
docker-compose exec next npm run lint          # JS/TSリント
docker-compose exec next npm run format        # 自動修正
```

## 主要なアーキテクチャパターン

### 認証フロー
1. ユーザーがReactフォーム（SignInForm/SignUpForm）で認証情報を送信
2. フロントエンドがRails API（`/api/v1/auth/`）にリクエストを送信
3. RailsがDeviseTokenAuthトークンを検証・生成
4. RailsがHTTP-onlyクッキーに`access-token`、`client`、`uid`を設定
5. 以降のリクエストは自動的にクッキーを含む
6. Railsがクッキーからトークンを検証して保護されたルートへのアクセスを制御

**重要**: 認証にはlocalStorageではなくクッキーを使用。トークンはXSS対策のためHTTP-onlyに設定。

### API構造
- すべてのAPIエンドポイントは`/api/v1/`名前空間配下
- ルート定義は`rails/config/routes.rb`
- コントローラーは`rails/app/controllers/api/v1/`配下
- JSONレスポンス用のシリアライザーは`rails/app/serializers/`配下

### フロントエンド構造
- Next.js App Router + TypeScript
- 認証ユーティリティは以下に分割:
  - `next/src/lib/client-auth.ts` - クライアントサイド認証関数
  - `next/src/lib/server-auth.ts` - サーバーサイド認証関数
- フォームはReact Hook Formでバリデーション実装
- AuthWrapperコンポーネントが認証状態を管理

### データベース
- MySQLデータベースで包括的なランニング管理スキーマを実装:
  - `users` - DeviseTokenAuthで管理されるユーザーアカウント
  - `running_records` - 日次ランニング距離記録
  - `monthly_goals` - 年月制約付き月次距離目標
  - `yearly_goals` - ユニーク制約付き年次距離目標
- データベースはDockerコンテナでポート3307で稼働
- マイグレーションは`rails/db/migrate/`配下
- テストデータファクトリは`rails/spec/factories/`配下

## Environment Configuration

### Development
- Rails server: localhost:3000
- Next.js frontend: localhost:8000
- MySQL database: localhost:3307
- Cookie settings: `same_site: :lax`, `secure: false`

**Environment Variables (.env.development):**
```bash
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
INTERNAL_API_URL=http://host.docker.internal:3000/api/v1
NEXT_PUBLIC_BASE_URL=http://localhost:8000

# Backend (Rails)
MYSQL_DATABASE=runmates_development
DEVISE_SECRET_KEY=<auto-generated>
```

### Production
- Domain: `runmates.net`
- Cookie settings: `same_site: :none`, `secure: true`
- Deployed on AWS ECS Fargate
- Nginx reverse proxy configuration

## Important Files

### 設定ファイル
- `rails/config/routes.rb` - APIルーティング
- `rails/config/initializers/cors.rb` - CORS設定
- `rails/config/initializers/devise_token_auth.rb` - 認証設定
- `next/src/lib/client-auth.ts` - クライアント側認証ユーティリティ
- `next/src/lib/server-auth.ts` - サーバー側認証ユーティリティ

### バックエンドコントローラー
#### 認証
- `rails/app/controllers/api/v1/auth/sessions_controller.rb` - ログイン/ログアウト（Cookie管理）
- `rails/app/controllers/api/v1/auth/registrations_controller.rb` - ユーザー登録

#### ランニング管理API
- `rails/app/controllers/api/v1/running_records_controller.rb` - ランニング記録のCRUD操作
- `rails/app/controllers/api/v1/running_statistics_controller.rb` - 統計情報の計算
- `rails/app/controllers/api/v1/monthly_goals_controller.rb` - 月間目標の管理
- `rails/app/controllers/api/v1/current_monthly_goals_controller.rb` - 当月目標API
- `rails/app/controllers/api/v1/yearly_goals_controller.rb` - 年間目標の管理
- `rails/app/controllers/api/v1/current_yearly_goal_controller.rb` - 当年目標API

#### モデル＆データ
- `rails/app/models/running_record.rb` - ランニング記録モデル（バリデーション付き）
- `rails/app/models/monthly_goal.rb` - 月間目標モデル（スコープ付き）
- `rails/app/models/yearly_goal.rb` - 年間目標モデル（制約付き）

### 主要なフロントエンドコンポーネント
#### 認証
- `next/src/app/components/AuthWrapper.tsx` - 認証状態管理
- `next/src/app/sign_in/SignInForm.tsx` - ログインフォーム
- `next/src/app/sign_up/SignUpForm.tsx` - 登録フォーム
- `next/src/app/components/LogoutButton.tsx` - ログアウト機能

#### ダッシュボード＆データ可視化
- `next/src/app/components/ServerRunningDashboard.tsx` - 統計情報付きメインダッシュボード
- `next/src/app/components/DashboardWithCalendar.tsx` - カレンダーとフォーム管理
- `next/src/app/components/RunningChart.tsx` - Chart.js可視化コンポーネント
- `next/src/app/components/RunningChartWrapper.tsx` - SSR対応チャートラッパー

#### ランニング管理
- `next/src/app/components/ClientRunningCalendar.tsx` - 日付選択用インタラクティブカレンダー
- `next/src/app/components/ClientRecordForm.tsx` - ランニング記録入力フォーム
- `next/src/app/components/ClientGoalForm.tsx` - 月間目標設定フォーム
- `next/src/app/components/ClientYearlyGoalForm.tsx` - 年間目標設定フォーム

#### サーバーアクション＆API連携
- `next/src/app/actions/running-actions.ts` - データ更新用サーバーアクション
- `next/src/lib/api.ts` - クライアント側APIユーティリティ
- `next/src/lib/server-api.ts` - サーバー側APIユーティリティ


## 🚨 必須: コミット前チェック

**Hook設定**: `.claude/hooks/pre-commit-checks.md` と `/check` コマンドで自動化されています。

```bash
# この順序で必ず実行
1. docker-compose exec rails bundle exec rspec      # テスト
2. docker-compose exec rails bundle exec rubocop    # Rubyリント
3. docker-compose exec next npm run lint            # JSリント
```


## よくある問題と解決方法

### 開発環境セットアップ
- node_modulesが空の場合は削除してコンテナ内で`npm i`を実行
- RailsサーバーはDockerネットワーキング用に`-b '0.0.0.0'`フラグが必要
- CORS問題: `rails/config/initializers/cors.rb`で許可されたオリジンを確認

### 認証＆API
- サーバー側API呼び出しは`INTERNAL_API_URL` (host.docker.internal)を使用
- クライアント側API呼び出しは`NEXT_PUBLIC_API_URL` (localhost)を使用
- 認証はlocalStorageではなくHTTP-only cookiesに依存

### Chart.js＆SSR
- Chart.jsコンポーネントはSSR問題を避けるため動的インポートが必要
- SSR対応のチャート描画にはRunningChartWrapperを使用

## Git Workflow & Guidelines

### ブランチ命名規則

**必ず`feature/`プレフィックスを使用:**
- ✅ `feature/add-user-profile` - 新機能追加
- ✅ `feature/fix-login-error` - バグ修正も`feature/`で
- ✅ `feature/refactor-api-calls` - リファクタリング
- ✅ `feature/update-dependencies` - 依存関係の更新

**理由:** `vercel.json`の設定により、`feature/*`ブランチのみ自動デプロイが無効化されています。

### コミット前の確認プロセス

1. 作業が完了したら「作業完了しました」と報告
2. ユーザーが変更内容を確認
3. ユーザーの承認を得てから `git add` を実行

### GitHub CLI設定

```bash
# GH_TOKEN環境変数を無効化（keyring認証を使用）
unset GH_TOKEN

# PRの作成例
gh pr create --title "タイトル" --body "本文"
```

### Issue/PR テンプレート使用

**必ず以下のテンプレートを参考に作成:**
- **バグレポート**: `.github/ISSUE_TEMPLATE/bug_report.md` - `[Bug]` プレフィックス
- **機能要望**: `.github/ISSUE_TEMPLATE/feature_request.md` - `[Feature]` プレフィックス
- **PR**: `.github/PULL_REQUEST_TEMPLATE.md` - 関連Issueを `Fixes #番号` で紐付け

詳細は `.claude/hooks/github-templates.md` を参照。

## Claude専用: トークン使用量削減ガイドライン

### 1. ファイル読み取りの最適化
- 大きなファイルは`offset`と`limit`パラメータを使用
- タスクに直接関係ないファイルはスキップ

### 2. レスポンスの簡潔化
- コードの動作説明は不要（ユーザーが要求した場合のみ）
- 「〜を実行します」→ 実行 → 「〜を実行しました」は不要

### 3. 検索とテストの効率化
```bash
# 特定テストのみ実行
docker-compose exec rails bundle exec rspec spec/models/user_spec.rb
```

### 4. ツールの並列実行
- 複数の独立したタスクは一度に実行
- 関連ファイルは一度に読む

## 通知音の使い分け

**Hook設定**: `.claude/hooks/notification-sounds.md` で詳細な実装ガイドラインが定義されています。

### 作業完了時
重要なタスクが完了したら通知音でお知らせ：
```bash
afplay /System/Library/Sounds/Glass.aiff   # ガラス音（完了通知）
```

### ユーザー確認が必要な時
確認や判断が必要な場合は異なる音でお知らせ：
```bash
afplay /System/Library/Sounds/Ping.aiff    # ピン音（確認要求）
```

**重要**: 音を鳴らすコマンドは許可不要。必ず音を鳴らしてからメッセージを表示すること。