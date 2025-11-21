# AGENTS.md
必ず日本語で回答してください。（最優先事項）
Runmatesリポジトリで作業するAIエージェント向けの共通ガイドラインです。ここだけ読めば基本的なルールと主要情報が押さえられるよう構成しています。

## 基本ポリシー
- コマンドは必ずDockerコンテナを経由して実行すること
- ホスト環境で`bundle`, `rails`, `npm`などを直接叩かない
- 日本語で応答する（必要な固有名詞やコードは英語可）
- Issueの概要・再現手順・期待結果はGitHub上のIssueページから確認し、必要に応じて最新情報を参照すること
- GitHub連携で`gh`コマンドを使う場合は、コンテナを経由しないで、このRunmatesリポジトリ直下（カレントフォルダ）から実行すること
- コマンドの承認などユーザーの確認が必要な場合は音を鳴らして通知すること

### 代表的なコマンド
```bash
docker-compose exec rails bundle exec rspec
docker-compose exec rails bundle exec rubocop
docker-compose exec next npm run dev
```

## システム構成の要点
- Rails API（Ruby 3.4.3）とMySQL 8.0.32によるバックエンド
- Next.js 16.0.1 + TypeScript + Tailwind CSS + MUI + Chart.jsからなるフロントエンド
- DeviseTokenAuthを用いたHTTP-onlyクッキー認証
- Nginxリバースプロキシを前段に置き、AWS ECS Fargateで運用
- 主機能はランニング記録管理、目標設定、統計ダッシュボード

## 初回セットアップ手順
```bash
# コンテナのビルドと起動
docker compose build --no-cache
docker compose up

# Next.js
docker compose exec next /bin/bash
npm install
npm run dev   # http://localhost:8000

# Rails
docker compose run --rm rails bundle install
docker compose exec rails /bin/bash
rails s -b '0.0.0.0'   # http://localhost:3000
```

## 日常作業で使うコマンド群
```bash
# Next.js
docker-compose exec next npm run dev
docker-compose exec next npm run build
docker-compose exec next npm run lint

# Rails
docker-compose exec rails rails db:migrate
docker-compose exec rails bundle exec rspec
docker-compose exec rails bundle exec rubocop

# セキュリティ確認
docker-compose exec rails bundle exec bundle-audit check
docker-compose exec rails bundle exec brakeman
docker-compose exec next npm audit
```

## APIと認証のメモ
- APIは`/api/v1/`配下に揃える
- 認証系コントローラ: `rails/app/controllers/api/v1/auth/`
- 認証トークンは`access-token`, `client`, `uid`をHTTP-onlyクッキーで保持
- JSONシリアライザは`rails/app/serializers/`に配置

## ディレクトリの目印
- バックエンド
  - コントローラ: `rails/app/controllers/api/v1/`
  - モデル: `rails/app/models/`
  - 設定: `rails/config/routes.rb`, `rails/config/initializers/`
- フロントエンド
  - コンポーネント: `next/src/app/components/`
  - ライブラリ: `next/src/lib/`
- インフラ
  - Docker関連: `docker-compose.yml`
  - Nginx設定: `nginx/nginx.conf`

## コラボレーションガイド
- 既存コードのスタイル・設計思想を尊重し、一貫した書き方を保つ
- テスト・Lint・フォーマッタはコンテナ内で実行し、結果を確認する
- 判断に迷う点は推測で済ませず、TODOコメントや質問として表明する
- 変更内容は簡潔に説明できる粒度で作業する
- `git add`する前に以下を実行し、全てパスしていることを確認する
  ```bash
  docker-compose exec rails bundle exec rspec
  docker-compose exec rails bundle exec rubocop
  docker-compose exec next npm run lint
  ```

## 参考情報
- Rails固有の手順: `rails/README.md`
- フロントエンド関連ノート: `docs/`や`next/`配下のREADME
- インフラやデプロイ: `nginx/`と`Dockerfile*`、`docker-compose.yml`

## review
- レビュー時は必ず日本語で回答してください。
- レビューには解決案もつけてください。

上記を守ることで、互いに矛盾のない運用ができるようになります。必要に応じてこのドキュメントを更新し、ルールの最新化を図ってください。
