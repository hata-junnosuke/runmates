# Runmates - ランニング管理アプリケーション

Runmatesは、ランニング愛好家のための包括的な記録管理・目標追跡アプリケーションです。日々のランニング記録を簡単に記録し、月間・年間目標の達成状況を視覚的に把握できます。

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
- **Styling**: Tailwind CSS + Material-UI (MUI)
- **主要パッケージ**:
  - `react-hook-form` - フォーム管理とバリデーション
  - `date-fns` - 日付処理ユーティリティ
  - `axios` - HTTP通信
  - `chart.js` + `react-chartjs-2` - データ可視化
  - `js-cookie` - クッキー管理

### Infrastructure
- **Container**: Docker & Docker Compose
- **Production**: AWS ECS Fargate
- **Proxy**: Nginx
- **CI/CD**: GitHub Actions

## 📁 プロジェクト構造

```
runmates/
├── rails/                    # Railsバックエンド
│   ├── app/
│   │   ├── controllers/     # APIコントローラー
│   │   │   └── api/v1/     # API v1エンドポイント
│   │   ├── models/          # データモデル
│   │   ├── mailers/         # メール送信
│   │   └── jobs/            # 非同期ジョブ
│   ├── config/              # 設定ファイル
│   │   ├── initializers/    # 初期化設定
│   │   └── routes.rb        # ルーティング定義
│   ├── db/                  # データベース関連
│   │   ├── migrate/         # マイグレーション
│   │   └── schema.rb        # スキーマ定義
│   ├── spec/                # RSpecテスト
│   │   ├── models/          # モデルテスト
│   │   ├── requests/        # APIテスト
│   │   └── factories/       # テストデータ
│   └── swagger/             # API仕様書
│       └── v1/
│           └── swagger.yaml # OpenAPI仕様
├── next/                    # Next.jsフロントエンド
│   ├── src/
│   │   ├── app/            # App Router
│   │   │   ├── components/ # UIコンポーネント
│   │   │   ├── sign_in/    # ログインページ
│   │   │   ├── sign_up/    # 登録ページ
│   │   │   └── dashboard/  # ダッシュボード
│   │   └── lib/            # ユーティリティ
│   │       ├── api.ts      # API通信
│   │       └── auth.ts     # 認証処理
│   ├── public/             # 静的ファイル
│   └── package.json        # 依存関係
├── docker-compose.yml       # Docker設定
├── .github/                 # GitHub設定
│   ├── workflows/          # GitHub Actions
│   └── ISSUE_TEMPLATE/     # Issueテンプレート
└── README.md               # このファイル
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

## 🔄 開発ワークフロー

### ブランチ戦略

```
main              # 本番環境（保護ブランチ）
├── feature/*     # 新機能開発
├── fix/*         # バグ修正
└── refactor/*    # リファクタリング
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

## 🐛 トラブルシューティング

### Docker関連

| 問題 | 解決方法 |
|------|---------|
| `Cannot connect to the Docker daemon` | Docker Desktopを起動 |
| `port is already allocated` | `lsof -i :ポート番号` で確認し、プロセスを停止 |
| コンテナが起動しない | `docker-compose down` → `docker-compose up --build` |
| ボリュームの問題 | `docker-compose down -v` でボリュームも削除 |

### Rails関連

| 問題 | 解決方法 |
|------|---------|
| `Migrations are pending` | `docker-compose exec rails rails db:migrate` |
| `Gem::LoadError` | `docker-compose exec rails bundle install` |
| テスト失敗 | `docker-compose exec rails rails db:test:prepare` |
| `Can't connect to MySQL` | MySQLコンテナの起動を確認 |

### Next.js関連

| 問題 | 解決方法 |
|------|---------|
| `Module not found` | `docker-compose exec next npm install` |
| 環境変数が読み込まれない | `.env.development` の設定を確認 |
| ホットリロードが効かない | `docker-compose restart next` |
| ビルドエラー | `docker-compose exec next rm -rf .next` → 再ビルド |

### 認証関連

| 問題 | 解決方法 |
|------|---------|
| ログインできない | ブラウザのクッキーをクリア |
| CORS エラー | `rails/config/initializers/cors.rb` の設定確認 |
| 401 Unauthorized | 認証ヘッダーの送信を確認 |

## 🚢 デプロイ

### 本番環境構成

- **インフラ**: AWS ECS Fargate
- **データベース**: Amazon RDS (MySQL)
- **CDN**: Amazon CloudFront
- **DNS**: Route 53
- **SSL証明書**: AWS Certificate Manager

### デプロイフロー

1. `main` ブランチへのマージ
2. GitHub Actions CI/CD パイプライン自動実行
   - テスト実行
   - コード品質チェック
   - Dockerイメージビルド
   - ECRへプッシュ
3. ECSタスク定義更新
4. ローリングデプロイ実行

### 環境変数

本番環境の環境変数はAWS Systems Manager Parameter Storeで管理

## 🤝 貢献方法

### 開発への参加

1. [Issues](https://github.com/hata-junnosuke/runmates/issues) を確認
2. 作業するIssueを選択またはIssue作成
3. featureブランチを作成
4. 変更を実装（テストを含む）
5. PRテンプレートを使用してPR作成
6. コードレビュー
7. マージ

### コーディング規約

- **Ruby**: `.rubocop.yml` の設定に従う
- **TypeScript/JavaScript**: `.eslintrc.json` の設定に従う
- **コミットメッセージ**: [Conventional Commits](https://www.conventionalcommits.org/) を推奨
  - `feat:` 新機能
  - `fix:` バグ修正
  - `docs:` ドキュメント
  - `style:` フォーマット
  - `refactor:` リファクタリング
  - `test:` テスト
  - `chore:` その他

## 📝 ライセンス

このプロジェクトは開発中です。

## 👥 チーム

- メンテナー: [hata-junnosuke](https://github.com/hata-junnosuke)

---

質問や提案がある場合は、[Issues](https://github.com/hata-junnosuke/runmates/issues) までお願いします。