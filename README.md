# Runmates - ランニング管理アプリケーション

Runmatesは、ランニング愛好家のための包括的な記録管理・目標追跡アプリケーションです。日々のランニング記録を簡単に記録し、月間・年間目標の達成状況を視覚的に把握できます。

## 💭 開発背景

このアプリケーションは、以下の2つの個人的な目的から開発をスタートしました：

### 1. エンジニアとしての学習機会の創出
フルスタックエンジニアとしてのスキル向上を目指し、モダンな技術スタック（Rails API + Next.js）を使用した実践的なアプリケーション開発を通じて、ハンズオンで学習する機会を作りたいと考えました。実際のプロダクト開発を通じて、設計・実装・デプロイ・運用まで一貫して経験することで、より深い理解と実践力を身につけることを目指しています。

### 2. ランニングのモチベーション維持
趣味のランニングを継続する上で、日々の記録を可視化し、目標達成状況を把握することがモチベーション維持に重要だと感じていました。既存のアプリケーションでは満たせない自分なりのニーズに応えるため、カスタマイズ可能な個人用ツールとして開発を進めています。

これらの目的を両立させることで、「作りながら学び、使いながら改善する」という継続的な開発サイクルを実現しています。

## 🎯 主要機能

- 📅 **カレンダーインターフェース** - 直感的な日付選択でランニング記録を管理
- 🎯 **目標設定と追跡** - 月間・年間の距離目標を設定し、達成率をリアルタイム表示
- 📊 **データ可視化** - Chart.jsによるインタラクティブなグラフで進捗を視覚化
- 📱 **レスポンシブデザイン** - スマートフォンからデスクトップまで最適化された UI
- 🔐 **セキュアな認証** - HTTP-onlyクッキーによる安全な認証システム
- 📧 **メール通知** - ウェルカムメール、パスワードリセット等の自動送信

## 🛠 技術スタック

### Backend (Rails API)
- **Framework**: Rails 8.0.2 (Ruby 3.4.3)
- **Database**: MySQL 8.0.32
- **Authentication**: DeviseTokenAuth (HTTP-only Cookie)
- **主要Gem**:
  - `rack-cors` - CORS対応
  - `factory_bot_rails` - テストデータ生成
  - `rspec-rails` - テストフレームワーク
  - `rubocop` - コード品質管理
  - `simplecov` - テストカバレッジ測定
  - `brakeman` - セキュリティスキャン
  - `bundle-audit` - 脆弱性チェック
  - `rswag` - API仕様書生成

### Frontend (Next.js)
- **Framework**: Next.js 15.3.1 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **主要パッケージ**:
  - `react-hook-form` - フォーム管理とバリデーション
  - `date-fns` - 日付処理ユーティリティ
  - `axios` - HTTP通信
  - `chart.js` + `react-chartjs-2` - データ可視化
  - `js-cookie` - クッキー管理
  - `@radix-ui` - UIプリミティブコンポーネント

### Infrastructure
- **Container**: Docker & Docker Compose
- **Frontend Hosting**: Vercel
- **Backend Hosting**: AWS ECS Fargate
- **Database**: Amazon RDS (MySQL)
- **CI/CD**: GitHub Actions (Backend) / Vercel (Frontend)
- **Proxy**: Nginx (Production)

## 📁 プロジェクト構造

```
runmates/
├── rails/                       # Railsバックエンド
│   ├── app/
│   │   ├── controllers/        # APIコントローラー
│   │   │   └── api/v1/        # API v1エンドポイント
│   │   │       ├── auth/      # 認証関連
│   │   │       └── current/   # 現在のユーザー関連
│   │   ├── models/             # データモデル
│   │   ├── mailers/            # メール送信
│   │   ├── jobs/               # 非同期ジョブ（SolidQueue）
│   │   ├── serializers/        # JSONシリアライザー
│   │   └── views/              # メールテンプレート
│   ├── config/                 # 設定ファイル
│   │   ├── initializers/       # 初期化設定（CORS、DeviseTokenAuth等）
│   │   ├── credentials.yml.enc # 暗号化された認証情報
│   │   └── routes.rb           # ルーティング定義
│   ├── db/                     # データベース関連
│   │   ├── migrate/            # マイグレーション
│   │   └── schema.rb           # スキーマ定義
│   ├── spec/                   # RSpecテスト
│   │   ├── models/             # モデルテスト
│   │   ├── requests/           # APIテスト
│   │   └── factories/          # テストデータ
│   ├── swagger/                # API仕様書
│   │   └── v1/
│   │       └── swagger.yaml    # OpenAPI仕様
│   └── lib/
│       └── tasks/              # Rakeタスク（annotate等）
├── next/                        # Next.jsフロントエンド
│   ├── src/
│   │   ├── app/                # App Router
│   │   │   ├── (auth)/        # 認証が必要なページ
│   │   │   │   └── dashboard/ # ダッシュボード
│   │   │   ├── sign_in/       # ログインページ
│   │   │   ├── sign_up/       # 登録ページ
│   │   │   └── layout.tsx     # ルートレイアウト
│   │   ├── components/         # 共通UIコンポーネント
│   │   │   └── ui/            # shadcn/ui コンポーネント
│   │   ├── features/           # 機能別モジュール
│   │   │   ├── auth/           # 認証機能
│   │   │   ├── running/        # ランニング記録機能
│   │   │   ├── account/        # アカウント管理
│   │   │   ├── profile/        # プロフィール
│   │   │   └── settings/       # 設定
│   │   ├── lib/                # ユーティリティ
│   │   │   └── api/           # API通信層
│   │   └── middleware.ts       # 認証ミドルウェア
│   ├── public/                 # 静的ファイル
│   └── package.json            # 依存関係
├── docker-compose.yml          # Docker設定
├── .github/                    # GitHub設定
│   ├── workflows/              # GitHub Actions
│   │   ├── cd.yml             # デプロイワークフロー
│   │   └── ci.yml             # テスト・品質チェック
│   ├── ISSUE_TEMPLATE/         # Issueテンプレート
│   │   ├── bug_report.md      # バグレポート用
│   │   └── feature_request.md # 機能要望用
│   └── PULL_REQUEST_TEMPLATE.md # PRテンプレート
├── .claude/                    # Claude Code設定
│   ├── commands/               # カスタムコマンド
│   │   ├── cpr.md             # PR作成コマンド
│   │   ├── security.md        # セキュリティチェック
│   │   ├── security-next.md   # Next.jsセキュリティ
│   │   └── security-rails.md  # Railsセキュリティ
│   ├── hooks/                  # 自動化フック
│   │   ├── github-templates.md    # GitHubテンプレート
│   │   ├── notification-sounds.md # 通知音設定
│   │   └── pre-commit-checks.md   # コミット前チェック
│   └── settings.local.json    # ローカル設定
├── .cursor/                    # Cursor IDE設定
├── CLAUDE.md                   # Claude Code用ガイドライン
├── vercel.json                 # Vercelデプロイ設定
└── README.md                   # このファイル
```

## 🚀 開発環境セットアップ

### 前提条件
- Docker Desktop がインストールされていること
- Git がインストールされていること

### 初回セットアップ

```bash
# 1. リポジトリをクローン
git clone https://github.com/hata-junnosuke/runmates.git
cd runmates

# 2. Dockerコンテナをビルド・起動
docker compose build --no-cache
docker compose up

# 3. フロントエンドセットアップ（新しいターミナルで）
docker compose exec next /bin/bash
npm i
npm run dev  # http://localhost:8000

# 4. バックエンドセットアップ（新しいターミナルで）
docker compose exec rails /bin/bash
rails db:create
rails db:migrate
rails db:seed  # テストデータ投入（開発環境のみ）

# 5. Rails Credentials設定（重要）
# 環境変数を設定するためにcredentialsを編集
docker-compose exec rails bash -c "EDITOR='vi' rails credentials:edit"
# 以下の内容を追加:
# development:
#   frontend_url: http://localhost:8000
# production:
#   frontend_url: https://runmates.net
# （viエディタ: i で挿入モード、ESCで終了、:wq で保存）

# 6. Railsサーバー起動
rails s -b '0.0.0.0'  # http://localhost:3000
```

## 💻 開発コマンド

**重要**: 全てのコマンドはDockerコンテナ内で実行してください

### Backend (Rails)

```bash
# サーバー起動
docker-compose exec rails rails s -b '0.0.0.0'

# データベース操作
docker-compose exec rails rails db:migrate
docker-compose exec rails rails db:seed
docker-compose exec rails rails db:rollback

# テスト実行
docker-compose exec rails bundle exec rspec              # 全テスト
docker-compose exec rails bundle exec rspec spec/models/  # モデルテストのみ
docker-compose exec rails bundle exec rspec --format documentation  # 詳細表示

# コード品質チェック
docker-compose exec rails bundle exec rubocop       # Rubyコードチェック
docker-compose exec rails bundle exec rubocop -a    # 自動修正
docker-compose exec rails bundle exec rubocop -A    # より積極的な自動修正

# セキュリティチェック
docker-compose exec rails bundle exec brakeman      # セキュリティスキャン
docker-compose exec rails bundle exec bundle-audit  # 脆弱性チェック

# Railsコンソール
docker-compose exec rails rails console
```

### Frontend (Next.js)

```bash
# 開発サーバー起動
docker-compose exec next npm run dev      # Turbopack使用

# ビルド
docker-compose exec next npm run build    # プロダクションビルド
docker-compose exec next npm run start    # プロダクションサーバー起動

# コード品質チェック
docker-compose exec next npm run lint     # ESLintチェック
docker-compose exec next npm run format   # Prettier自動整形

# 依存関係管理
docker-compose exec next npm install      # パッケージインストール
docker-compose exec next npm audit        # 脆弱性チェック
docker-compose exec next npm audit fix    # 脆弱性自動修正
```

## 📚 API仕様書

### Swagger UI アクセス

開発環境でRailsサーバー起動後、以下のURLでAPI仕様書を確認できます：

**Swagger UI**: http://localhost:3000/api-docs

### API エンドポイント一覧

| カテゴリ | メソッド | エンドポイント | 説明 |
|---------|----------|--------------|------|
| **認証** | POST | `/api/v1/auth` | ユーザー登録 |
| | POST | `/api/v1/auth/sign_in` | ログイン |
| | DELETE | `/api/v1/auth/sign_out` | ログアウト |
| | PUT | `/api/v1/auth` | アカウント更新 |
| | POST | `/api/v1/auth/password` | パスワードリセット |
| **ランニング記録** | GET | `/api/v1/running_records` | 記録一覧取得 |
| | POST | `/api/v1/running_records` | 記録作成 |
| | GET | `/api/v1/running_records/:id` | 記録詳細取得 |
| | PUT | `/api/v1/running_records/:id` | 記録更新 |
| | DELETE | `/api/v1/running_records/:id` | 記録削除 |
| **月間目標** | GET | `/api/v1/monthly_goals` | 月間目標一覧 |
| | POST | `/api/v1/monthly_goals` | 月間目標作成 |
| | GET | `/api/v1/current_monthly_goal` | 今月の目標取得 |
| **年間目標** | GET | `/api/v1/yearly_goals` | 年間目標一覧 |
| | POST | `/api/v1/yearly_goals` | 年間目標作成 |
| | GET | `/api/v1/current_yearly_goal` | 今年の目標取得 |
| **統計** | GET | `/api/v1/running_statistics` | 統計情報取得 |

詳細な仕様は `rails/swagger/v1/swagger.yaml` を参照してください。

## 🔧 環境変数管理

### フロントエンド (Next.js) - GitHub Secrets設定

本番環境のフロントエンド環境変数は、GitHub ActionsのSecretsを使用してVercelにデプロイ時に設定されます。

#### 設定手順

1. GitHubリポジトリの Settings → Secrets and variables → Actions へ移動
2. 「New repository secret」をクリック
3. 以下の環境変数を追加：
   - `AWS_ACCESS_KEY_ID` - AWSアクセスキーID
   - `AWS_SECRET_ACCESS_KEY` - AWSシークレットアクセスキー
   - `RAILS_MASTER_KEY` - Rails master.keyの内容
   - `NEXT_PUBLIC_API_URL` - APIのパブリックURL
   - `NEXT_PUBLIC_BASE_URL` - フロントエンドのベースURL
   - `INTERNAL_API_URL` - 内部API URL（サーバーサイド用）

4. GitHub Actionsワークフロー（`.github/workflows/cd.yml`）で環境変数を参照：
```yaml
# AWS認証
aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

# Railsビルド時
--build-arg RAILS_MASTER_KEY=${{ secrets.RAILS_MASTER_KEY }}
--build-arg NEXT_PUBLIC_BASE_URL=${{ secrets.NEXT_PUBLIC_BASE_URL }}

# Next.js環境変数（現在はコメントアウト中）
NEXT_PUBLIC_API_URL=${{ secrets.NEXT_PUBLIC_API_URL }}
NEXT_PUBLIC_BASE_URL=${{ secrets.NEXT_PUBLIC_BASE_URL }}
INTERNAL_API_URL=${{ secrets.INTERNAL_API_URL }}
```

**注意**: 現在、Next.jsはVercelで直接デプロイされているため、Next.jsのECSデプロイ部分はコメントアウトされています。

### バックエンド (Rails) - Credentials管理

Railsアプリケーションの環境変数は、暗号化されたCredentialsで管理しています。

#### 設定方法

```bash
# Credentialsファイルを編集
docker-compose exec rails bash -c "EDITOR='vi' rails credentials:edit"
```

#### 設定内容

```yaml
# 環境別設定
development:
  frontend_url: http://localhost:8000  # 開発環境のフロントエンドURL

production:
  frontend_url: https://runmates.net   # 本番環境のフロントエンドURL

test:
  frontend_url: http://localhost:8000  # テスト環境のフロントエンドURL

# 既存のsecret_key_baseはそのまま残す
secret_key_base: xxxxx
```

#### viエディタの操作
1. `i` キー: 挿入モード開始
2. 編集後、`ESC` キー: 挿入モード終了
3. `:wq` + Enter: 保存して終了
4. `:q!` + Enter: 保存せずに終了（変更を破棄）

#### 設定値の確認

```bash
# 現在の環境の設定を確認
docker-compose exec rails rails runner "puts Rails.application.credentials.dig(Rails.env.to_sym, :frontend_url)"

# 特定環境の設定を確認
docker-compose exec rails rails runner "puts Rails.application.credentials.dig(:production, :frontend_url)"
```

#### 本番環境での管理
- `config/credentials.yml.enc`: 暗号化された設定（リポジトリに含まれる）
- `config/master.key`: 復号化キー（.gitignoreで除外、安全に管理）
- 環境変数`RAILS_MASTER_KEY`でもmaster.keyを設定可能

## 🔄 開発ワークフロー

### ブランチ戦略

```
main              # 本番環境（保護ブランチ）
├── feature/*     # 新機能開発
```

**重要**: `feature/*` ブランチは自動デプロイが無効化されています

### コミット前チェックリスト

```bash
# 1. テスト実行
docker-compose exec rails bundle exec rspec

# 2. Rubyコード品質チェック
docker-compose exec rails bundle exec rubocop

# 3. JavaScriptコード品質チェック
docker-compose exec next npm run lint

# 4. セキュリティチェック（定期的に）
docker-compose exec rails bundle exec brakeman
docker-compose exec rails bundle exec bundle-audit
```

### プルリクエスト作成

1. Issueを作成または選択
2. featureブランチを作成: `git checkout -b feature/issue-番号-説明`
3. 変更を実装
4. テストを追加・更新
5. コミット: `git commit -m "feat: 機能説明"`
6. プッシュ: `git push origin feature/branch-name`
7. PRテンプレートを使用してPR作成
8. CI/CDパイプラインの通過を確認
9. コードレビュー後マージ

## 🚢 デプロイ

### 本番環境構成

#### フロントエンド (Next.js)
- **ホスティング**: Vercel
- **自動デプロイ**: GitHubとの連携により、mainブランチへのプッシュで自動デプロイ
- **URL**: https://runmates.net

#### バックエンド (Rails API)
- **インフラ**: AWS ECS Fargate
- **データベース**: Amazon RDS (MySQL)
- **DNS**: Route 53
- **SSL証明書**: AWS Certificate Manager

### デプロイフロー

#### フロントエンド (Vercel)
1. `main` ブランチへのマージ
2. Vercelが自動的にビルド・デプロイを実行
3. プレビューデプロイ機能により、PRごとにプレビュー環境も自動生成

#### バックエンド (AWS)
1. `main` ブランチへのマージ
2. GitHub Actions CI/CD パイプライン自動実行
   - テスト実行
   - コード品質チェック
   - Dockerイメージビルド
   - ECRへプッシュ
3. ECSタスク定義更新
4. ローリングデプロイ実行

### 環境変数

本番環境の環境変数管理：
- **フロントエンド (Next.js)**: GitHub ActionsのSecretsで管理
- **バックエンド (Rails)**: Rails Credentialsで暗号化管理 (`config/credentials.yml.enc`)


## 📝 ライセンス

このプロジェクトは開発中です。

## 👥 チーム

- メンテナー: [hata-junnosuke](https://github.com/hata-junnosuke)

---

質問や提案がある場合は、[Issues](https://github.com/hata-junnosuke/runmates/issues) までお願いします。