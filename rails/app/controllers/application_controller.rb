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
      return if request.headers['access-token'].present?

      # クッキーから認証情報を取得してヘッダーにセット
      if cookies[:access_token].present? && cookies[:client].present? && cookies[:uid].present?
        request.headers['access-token'] = cookies[:access_token]
        request.headers['client'] = cookies[:client]
        request.headers['uid'] = cookies[:uid]
        request.headers['token-type'] = 'Bearer'
      end
    end
end
