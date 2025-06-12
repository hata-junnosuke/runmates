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
      if request.cookies['access_token'].present? && request.cookies['client'].present? && request.cookies['uid'].present?
        request.headers['access-token'] = request.cookies['access_token']
        request.headers['client'] = request.cookies['client']
        request.headers['uid'] = request.cookies['uid']
        request.headers['token-type'] = 'Bearer'
      end
    end
end
