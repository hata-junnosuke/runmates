# 🏃 Runmates - ランニング管理アプリケーション
Runmatesは、ランニング愛好家のための包括的な記録管理・目標管理アプリケーションです。

日々のランニング記録を簡単に記録し、月間・年間目標の達成状況を視覚的に把握できます。
<div align="center">
  <img width="600" alt="Runmatesロゴ" src="https://github.com/user-attachments/assets/9fb8a4de-0f73-4840-9bc4-8d5f29157670" />
</div>
<table>
  <tr>
    <td width="60%">
      <img width="100%" alt="ダッシュボード" src="https://github.com/user-attachments/assets/5cc4f23c-76da-440a-8ac8-40ada815b75d" />
    </td>
    <td width="40%" valign="top">
      <h3>📊 すべての走りが数値とグラフに</h3>
      <p>
        年間累計・月間実績・目標達成率を一目で確認。<br/>
        あなたの努力が数字として蓄積されていきます。
      </p>
      <br/>
      <h3>🌱 走った日はカレンダーが緑に染まる</h3>
      <p>
        GitHubの草のように、毎日の記録が色となって現れます。<br/>
        記録を残して、カレンダーを緑で埋め尽くそう。
      </p>
      <br/>
      <h3>📈 月間の進捗を可視化</h3>
      <p>
        Chart.jsによるインタラクティブなグラフで月間の進捗を視覚化
      </p>
    </td>
  </tr>
</table>

## 💭 開発背景

このアプリケーションは、以下の2つの個人的な目的から開発をスタートしました：

### 1. エンジニアとしての学習機会の創出
フルスタックエンジニアとしてのスキル向上を目指し、モダンな技術スタック（Rails API + Next.js）を使用した実践的なアプリケーション開発を通じて、ハンズオンで学習する機会を作りたいと考えました。

さらに、日々進化するAI技術をキャッチアップするため、Claude Codeを活用したAI駆動開発を実践。`.claude`ディレクトリにカスタムコマンドやフックを設定し、このプロジェクトに最適化された開発環境を構築しています。AIとの協働により、効率的な開発サイクルを実現しながら、最新のAI開発手法を学び、設計・実装・デプロイ・運用まで一貫して経験することで、より深い理解と実践力を身につけることを目指しています。(10月よりcodexも使用開始)


<p align="center">
  <img height="80" alt="claude-color" src="https://github.com/user-attachments/assets/f120f1eb-b117-4b10-aa64-371761f07c96" />
  &nbsp;&nbsp;
  <img height="80" alt="claude-text" src="https://github.com/user-attachments/assets/e8e781db-3663-4fd7-bc94-9adc125859ab" />
</p>


### 2. ランニングのモチベーション維持
趣味のランニングを継続する上で、日々の記録を可視化し、目標達成状況を把握することがモチベーション維持に重要だと感じていました。既存のアプリケーションでは満たせない自分なりのニーズに応えるため、カスタマイズ可能な個人用ツールとして開発を進めています。

これらの目的を両立させることで、「作りながら学び、使いながら改善する」という継続的な開発サイクルを実現しています。

## 🎯 主要機能

- 📊 **データ可視化** - Chart.jsによるインタラクティブなグラフで進捗を視覚化
- 🎯 **目標設定と追跡** - 月間・年間の距離目標を設定し、達成率をリアルタイム表示
- 📅 **カレンダーインターフェース** - 直感的な日付選択でランニング記録を管理
- 📱 **レスポンシブデザイン** - スマートフォンからデスクトップまで最適化された UI
- 🔐 **セキュアな認証** - HTTP-onlyクッキーによる安全な認証システム
- 📧 **メール通知** - ウェルカムメール、パスワードリセット等の自動送信

## 🛠 技術スタック

### フロントエンド (Next.js)
- **フレームワーク**: Next.js 16.0.1 with TypeScript
- **スタイリング**: Tailwind CSS + shadcn/ui
- **主要ライブラリ**:
  - `react-hook-form` - フォーム管理とバリデーション
  - `react-chartjs-2` - データ可視化
 
### バックエンド (Rails API)
- **フレームワーク**: Rails 8.0.2 (Ruby 4.0.0)
- **データベース**: MySQL 8.0.32
- **認証**: DeviseTokenAuth (HTTP-only Cookie)
- **主要Gem**:
  - `factory_bot_rails` - テストデータ生成
  - `rspec-rails` - テストフレームワーク
  - `rubocop` - コード品質管理
  - `simplecov` - テストカバレッジ測定
  - `rswag` - API仕様書生成

### インフラ構成
#### フロントエンド (Next.js)
- **ホスティング**: Vercel

#### バックエンド (Rails API)
- **インフラ**: ECS Fargate
- **コンテナイメージ管理**: Elastic Container Resistory
- **データベース**: Amazon RDS (MySQL)
- **DNS**: Route 53
- **ロードバランサー**: Application Load Balancer
- **SSL証明書**: AWS Certificate Manager
- **メール送信**: Simple Mail Service

#### CI/CD
- **CI**
  - GitHub Actions で構築
- **CD** 
  - フロントエンド: GitHubとVercelを連携して構築
  - バックエンド: GitHub Actions で構築

<div align="center">
  <img width="800" alt="ダッシュボード" src="https://github.com/user-attachments/assets/86f5a6b1-6e0b-4ed4-8312-5405538b928e" />
</div>

## 💻 開発環境セットアップ

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

### フロントエンド (Next.js)

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

### バックエンド (Rails)

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

## 📚 API仕様書

### Swagger UI アクセス

開発環境でRailsサーバー起動後、以下のURLでAPI仕様書を確認できます：

**Swagger UI**: http://localhost:3000/api-docs

<div align="center">
  <img width="800" alt="ダッシュボード" src="https://github.com/user-attachments/assets/8e86b997-c78c-4722-ba87-bfa980553ca2" />
</div>

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
├── fix/*     # バグ修正
├── refactor/*     # リファクタリング
```

**重要**: `feature/*`、`fix/*`、`refactor/*` ブランチは自動デプロイが無効化されています

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
2. feature/fix/refactorブランチを作成
3. 変更を実装
4. テストを追加・更新
5. コミット: `git commit -m "feat: 機能説明"`
6. プッシュ: `git push origin feature/branch-name`
7. PRテンプレートを使用してPR作成
8. CIの通過を確認
9. コードレビュー後mainブランチにマージ

## 🚢 デプロイ

### デプロイフロー

#### フロントエンド (Vercel)
1. `main` ブランチへのマージ
2. Vercelが自動的にビルド・デプロイを実行

#### バックエンド (AWS)
1. `main` ブランチへのマージ
2. GitHub Actions CI/CD パイプライン自動実行
   - テスト実行
   - コード品質チェック
   - Dockerイメージビルド
   - ECRへプッシュ
3. ECSタスク定義更新
4. 自動デプロイ実行

## 🚀 今後の機能追加予定
[Issues](https://github.com/hata-junnosuke/runmates/issues) にて計画


## 📝 ライセンス

このプロジェクトは開発中です。

## 👥 チーム

- メンテナー: [hata-junnosuke](https://github.com/hata-junnosuke)

## 🔑 お試しアカウント
```
メールアドレス: jh19911209+1@gmail.com
パスワード: pN4vJ8dB2kz7PMY
```

---

質問や提案がある場合は、[Issues](https://github.com/hata-junnosuke/runmates/issues) までお願いします。
