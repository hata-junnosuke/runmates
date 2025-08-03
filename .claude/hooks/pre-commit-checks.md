# Pre-commit チェック設定

## 概要
Claude Codeがコミットを行う前に、必ず以下のチェックを実行してください。

## 必須チェック項目

### 1. RSpec（バックエンドテスト）
```bash
docker-compose exec rails bundle exec rspec
```
- 全てのテストがパスすることを確認
- 失敗した場合はコミット前に修正

### 2. RuboCop（Rubyコードスタイル）
```bash
docker-compose exec rails bundle exec rubocop
```
- 違反がある場合は自動修正を試行：
  ```bash
  docker-compose exec rails bundle exec rubocop -a
  ```

### 3. ESLint（フロントエンドコードスタイル）
```bash
docker-compose exec next npm run lint
```
- エラーがある場合は自動修正を試行：
  ```bash
  docker-compose exec next npm run format
  ```

## 実行順序
1. テスト実行（RSpec）
2. バックエンドのリント（RuboCop）
3. フロントエンドのリント（ESLint）
4. 全てパスしたらコミット

## 注意事項
- 一つでも失敗した場合はコミットを中止
- 自動修正後は必ず再度テストを実行
- Docker コンテナが起動していることを確認