# frozen_string_literal: true

if defined?(Bullet)
  Rails.application.configure do
    # Bulletの設定をより詳細に制御
    Bullet.enable = true

    # 通知方法の設定
    Bullet.alert = true # JavaScriptアラート
    Bullet.bullet_logger = true # log/bullet.logに出力
    Bullet.console = true # ブラウザのconsole.logに出力
    Bullet.rails_logger = true # Railsのログに出力
    Bullet.add_footer = true # HTMLページ下部に表示

    # 検出対象の設定
    Bullet.n_plus_one_query_enable = true # N+1クエリ検出を有効化
    Bullet.unused_eager_loading_enable = true # 不要なeager loading検出を有効化
    Bullet.counter_cache_enable = true # counter cacheの提案を有効化

    # 除外設定の例（必要に応じて追加）
    # Bullet.add_safelist type: :n_plus_one_query, class_name: "User", association: :posts
    # Bullet.add_safelist type: :unused_eager_loading, class_name: "User", association: :posts
    # Bullet.add_safelist type: :counter_cache, class_name: "User", association: :posts

    # 特定のパスを除外（必要に応じて追加）
    # Bullet.add_safelist type: :n_plus_one_query, path: /admin/

    # Slack通知（必要に応じて設定）
    # Bullet.slack = { webhook_url: 'YOUR_SLACK_WEBHOOK_URL' }
  end
end
