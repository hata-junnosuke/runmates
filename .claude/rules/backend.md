---
paths:
  - "rails/**"
---

# Rails ルール

## 基本方針
- Rails Way（Railsの規約）に沿って実装する。命名規則・ディレクトリ構成・ルーティングなどはRailsのデフォルト規約に従い、明示的な指定やオーバーライドは最小限にする

## Controllerの設計原則（API専用）
- API専用構成（`config.api_only = true`）。`new`/`edit`は使わない
- 基本アクションは5つ: `index`, `show`, `create`, `update`, `destroy`
- カスタムアクションが必要な場合はコントローラーを分割する（例: `users/activations_controller.rb`）
- Fat Controllerを避ける。ビジネスロジックはモデルに移す（Service Objectsは使わない）

## Swaggerドキュメント
- APIのエンドポイント追加・変更・削除を行った場合は `rails/swagger/v1/swagger.yaml` も合わせて更新する
- パラメータ、レスポンス形式、ステータスコードの変更も反映する

## パフォーマンス
- N+1クエリを防止する。関連データの取得には`includes`/`preload`を使用する

## 認証
- 認証にはlocalStorageではなくHTTP-onlyクッキーを使用（XSS対策）
- RailsがHTTP-onlyクッキーに`access-token`、`client`、`uid`を設定

## テスト
- モデルテストは必須。バリデーション・スコープ・メソッドをカバーする
- テストデータはFactoryBotを使用する（`rails/spec/factories/`配下）
- request specではHTTPリクエストに `as: :json` を必ず指定する（本番のAPI呼び出しと同じJSON送信にするため）。ただしGETリクエストでparamsを渡す場合は `as: :json` を付けない（paramsがJSON bodyとして送信されクエリパラメータとして認識されないため）

## レビュー
- Railsコードの変更後は必ず `ruby-on-rails-best-practices` スキルでRails Way準拠をチェックする
