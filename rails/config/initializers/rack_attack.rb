# frozen_string_literal: true

# Rack::Attack によるAPIレート制限設定
# ブルートフォース攻撃やDoS対策として認証エンドポイントにレート制限を適用
# キャッシュストアはRails.cacheを使用（本番: Solid Cache、開発: MemoryStore）

# ログイン: 同一IPから1分間に10回まで
Rack::Attack.throttle("auth/sign_in", limit: 10, period: 60) do |req|
  req.ip if req.post? && req.path == "/api/v1/auth/sign_in"
end

# パスワードリセット: 同一IPから1分間に5回まで
Rack::Attack.throttle("auth/password", limit: 5, period: 60) do |req|
  req.ip if req.post? && req.path == "/api/v1/auth/password"
end

# ユーザー登録: 同一IPから1分間に3回まで
Rack::Attack.throttle("auth/registration", limit: 3, period: 60) do |req|
  req.ip if req.post? && req.path == "/api/v1/auth"
end

# レート制限超過時のレスポンス
Rack::Attack.throttled_responder = ->(_env) do
  retry_after = 60
  [
    429,
    {
      "Content-Type" => "application/json",
      "Retry-After" => retry_after.to_s,
    },
    [{ error: "リクエスト制限に達しました。しばらくしてから再度お試しください。" }.to_json],
  ]
end
