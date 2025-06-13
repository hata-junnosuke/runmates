class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  include DeviseHackFakeSession

  before_action :set_auth_headers_from_cookies

  def ping
    render json: { message: "pong" }
  end

  private

    def set_auth_headers_from_cookies
      # ヘッダーに認証情報がない場合のみクッキーから取得
      return if request.headers["access-token"].present?
      return unless auth_cookies_present?

      set_auth_headers_from_cookie_values
    end

    def auth_cookies_present?
      request.cookies["access_token"].present? &&
        request.cookies["client"].present? &&
        request.cookies["uid"].present?
    end

    def set_auth_headers_from_cookie_values
      request.headers["access-token"] = request.cookies["access_token"]
      request.headers["client"] = request.cookies["client"]
      request.headers["uid"] = request.cookies["uid"]
      request.headers["token-type"] = "Bearer"
    end
end
