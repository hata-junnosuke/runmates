# API仕様書の共有戦略

## 推奨される共有方法

### 1. 開発チーム内での共有
**Basic認証で保護**
- 本番環境でもSwagger UIを公開するが、Basic認証で保護
- チームメンバーにユーザー名とパスワードを共有
- URL: `https://runmates.net/api-docs`

```ruby
# config/initializers/rswag_ui.rb
Rswag::Ui.configure do |c|
  c.swagger_endpoint "/api-docs/v1/swagger.yaml", "API V1 Docs"
  
  if Rails.env.production?
    c.basic_auth_enabled = true
    c.basic_auth_credentials ENV['API_DOCS_USERNAME'], ENV['API_DOCS_PASSWORD']
  end
end
```

環境変数の設定：
```bash
# .env.production
API_DOCS_USERNAME=
API_DOCS_PASSWORD=
```

### 2. 外部パートナーとの共有
**静的ファイルとして共有**
```bash
# Swagger YAMLファイルを生成
docker-compose exec rails bundle exec rake rswag:specs:swaggerize

# 静的ファイルとしてエクスポート
docker-compose exec rails bundle exec rake swagger:export
```

共有方法：
- YAMLファイルを直接送付
- Swagger Hubにアップロード（無料プランあり）
- GitHub Pagesでホスティング
- Postman Collectionとしてインポート

### 3. 公開API（将来的に）
**バージョン管理されたドキュメント**
- `/api/v1/docs` - v1 API仕様書
- `/api/v2/docs` - v2 API仕様書（将来）
- APIキーによるアクセス制御

### 4. CI/CDとの統合（未実装）
**自動更新**
```yaml
# .github/workflows/api-docs.yml
name: Update API Documentation

on:
  push:
    branches: [main]
    paths:
      - 'rails/spec/integration/**'
      - 'rails/app/controllers/api/**'

jobs:
  update-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Generate Swagger docs
        run: docker-compose exec rails bundle exec rake rswag:specs:swaggerize
      - name: Deploy to documentation site
        run: # デプロイコマンド
```

## セキュリティ考慮事項

### ⚠️ 注意すべき点
1. **本番環境のエンドポイントを公開しない**
   - 内部APIのURLは隠す
   - センシティブなパラメータは例示しない

2. **認証情報の例を含めない**
   - 実際のAPIキーを記載しない
   - テスト用のダミーデータを使用

3. **アクセス制御**
   - 必要最小限の人だけがアクセスできるようにする
   - アクセスログを監視

## 実装手順

### Step 1: Basic認証の設定（推奨）
```bash
# 1. 環境変数を設定
echo "API_DOCS_USERNAME=runmates_api" >> .env.production
echo "API_DOCS_PASSWORD=$(openssl rand -base64 32)" >> .env.production

# 2. rswag_ui.rbを更新
cp config/initializers/rswag_ui_with_auth.rb.example config/initializers/rswag_ui.rb

# 3. デプロイ
git add .
git commit -m "feat: API仕様書にBasic認証を追加"
git push
```

### Step 2: 共有用URLの作成
```
# Basic認証ありの場合
https://runmates_api:password@runmates.net/api-docs

# または認証ダイアログが表示される
https://runmates.net/api-docs
```

### Step 3: 代替手段の準備
```bash
# 静的ファイルとして出力
docker-compose exec rails bundle exec rake swagger:export

# HTMLファイルとして生成
docker-compose exec rails bundle exec rake swagger:generate_html
```

## よくある質問

### Q: 誰でもAPI仕様書を見られるのは問題ない？
A: 公開APIの場合は問題ありませんが、内部APIの場合はBasic認証やIP制限で保護することを推奨します。

### Q: Swagger UIを無効化したい場合は？
A: 本番環境のroutes.rbで条件分岐を追加：
```ruby
unless Rails.env.production?
  mount Rswag::Ui::Engine => "/api-docs"
end
```

### Q: 特定のエンドポイントだけ非公開にしたい
A: swagger_helper.rbでタグやパスごとに制御可能：
```ruby
if Rails.env.production?
  # 内部APIは除外
  config.openapi_specs['v1/swagger.yaml'][:paths].delete('/api/v1/internal')
end
```