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

## TDD（テスト駆動開発）

Rails機能の開発はTDDで行う。

1. **Red** — 先にRSpecテストを書き、失敗を確認する
2. **Green** — テストを通す最小限の実装を書く
3. **Refactor** — テストが通った状態でリファクタリングする

## テスト
- モデルテストは必須。バリデーション・スコープ・メソッドをカバーする
- テストデータはFactoryBotを使用する（`rails/spec/factories/`配下）
- request specではHTTPリクエストに `as: :json` を必ず指定する（本番のAPI呼び出しと同じJSON送信にするため）。ただしGETリクエストでparamsを渡す場合は `as: :json` を付けない（paramsがJSON bodyとして送信されクエリパラメータとして認識されないため）

## Rubocopへの対応方針

Rubocopで検出されたすべての違反に対応すること。対応方法の優先順位：
1. **コードの改善で対応** - 可能な限りコードを改善して違反を解消
2. **rubocop:disable コメントで無効化** - コード改善が困難な場合のみ使用
3. **設定ファイルでの除外は最終手段** - .rubocop.ymlへの除外追加は避ける

## パフォーマンス
- N+1クエリを防止する。関連データの取得には`includes`/`preload`を使用する

## 認証
- 認証にはlocalStorageではなくHTTP-onlyクッキーを使用（XSS対策）
- RailsがHTTP-onlyクッキーに`access-token`、`client`、`uid`を設定

## Swaggerドキュメント
- APIのエンドポイント追加・変更・削除を行った場合は `rails/swagger/v1/swagger.yaml` も合わせて更新する
- パラメータ、レスポンス形式、ステータスコードの変更も反映する

## レビュー
- Railsコードの変更後は必ず `ruby-on-rails-best-practices` スキルでRails Way準拠をチェックする
