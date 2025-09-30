class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  include DeviseHackFakeSession

  before_action :set_auth_headers_from_cookies

  def ping
    render json: { message: "pong" }
  end

  private

    def set_auth_headers_from_cookies
      # デバッグログ: Cookieの受信状態を確認
      log_cookie_debug_info
      # ヘッダーに認証情報がない場合のみクッキーから取得
      return if request.headers["access-token"].present?
      return unless auth_cookies_present?

      set_auth_headers_from_cookie_values
    end

    def auth_cookies_present?
      request.cookies["access-token"].present? &&
        request.cookies["client"].present? &&
        request.cookies["uid"].present?
    end

    def set_auth_headers_from_cookie_values
      request.headers["access-token"] = request.cookies["access-token"]
      request.headers["client"] = request.cookies["client"]
      request.headers["uid"] = request.cookies["uid"]
      request.headers["token-type"] = "Bearer"
    end

    # rubocop:disable Metrics/AbcSize
    def log_cookie_debug_info
      Rails.logger.info "🔍 Cookie Debug Info:"
      Rails.logger.info "  Request from: #{request.origin || "unknown origin"}"
      Rails.logger.info "  Request URL: #{request.url}"
      Rails.logger.info "  Cookies received: #{request.cookies.keys.join(", ")}"
      Rails.logger.info "  access-token cookie: #{request.cookies["access-token"].present? ? "present" : "missing"}"
      Rails.logger.info "  client cookie: #{request.cookies["client"].present? ? "present" : "missing"}"
      Rails.logger.info "  uid cookie: #{request.cookies["uid"].present? ? "present" : "missing"}"
      Rails.logger.info "  Headers - access-token: #{request.headers["access-token"].present? ? "present" : "missing"}"
    end
  # rubocop:enable Metrics/AbcSize
end
