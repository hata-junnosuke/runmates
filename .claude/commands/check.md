# /check コマンド

## 概要
コミット前の必須チェックを全て実行します。

## 実行内容
1. RSpec（テスト）
2. RuboCop（バックエンドリント）
3. ESLint（フロントエンドリント）

## 使用方法
```
/check
```

## 動作
以下のコマンドを順番に実行します：
```bash
docker-compose exec rails bundle exec rspec
docker-compose exec rails bundle exec rubocop
docker-compose exec next npm run lint
```

全てのチェックがパスした場合のみ、コミットを続行してください。