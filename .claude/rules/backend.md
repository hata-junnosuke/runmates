---
paths:
  - "rails/**"
---

# Rails ルール

## Controllerの設計原則（API専用）
- API専用構成（`config.api_only = true`）。`new`/`edit`は使わない
- 基本アクションは5つ: `index`, `show`, `create`, `update`, `destroy`
- カスタムアクションが必要な場合はコントローラーを分割する（例: `users/activations_controller.rb`）
- Fat Controllerを避ける。ビジネスロジックはモデルやServiceオブジェクトに移す

## パフォーマンス
- N+1クエリを防止する。関連データの取得には`includes`/`preload`を使用する

## 認証
- 認証にはlocalStorageではなくHTTP-onlyクッキーを使用（XSS対策）
- RailsがHTTP-onlyクッキーに`access-token`、`client`、`uid`を設定

## テスト
- モデルテストは必須。バリデーション・スコープ・メソッドをカバーする
- テストデータはFactoryBotを使用する（`rails/spec/factories/`配下）
