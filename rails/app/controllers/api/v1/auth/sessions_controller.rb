class Api::V1::Auth::SessionsController < DeviseTokenAuth::SessionsController
  include AuthCookieHelper

  # rubocop:disable Rails/LexicallyScopedActionFilter
  after_action :set_auth_cookies, only: [:create]
  after_action :clear_auth_cookies, only: [:destroy]
  # rubocop:enable Rails/LexicallyScopedActionFilter

  def create
    # 親クラスのcreateを呼び出す
    super do |resource|
      # メール確認チェック
      if resource && !resource.confirmed?
        # 認証は成功したが確認が済んでいない場合
        sign_out(resource)
        render json: {
          success: false,
          errors: ["メールアドレスの確認が完了していません。確認メールをご確認ください。"],
        }, status: :unauthorized
        return
      end
    end
  end

  private

    def set_auth_cookies
      if @resource&.persisted? && response.status == 200 && @resource.confirmed?
        auth_headers_data = @resource.create_new_auth_token
        set_auth_cookie("access-token", auth_headers_data["access-token"])
        set_auth_cookie("client", auth_headers_data["client"])
        set_auth_cookie("uid", auth_headers_data["uid"])
      end
    end

    def clear_auth_cookies
      clear_auth_cookie("access-token")
      clear_auth_cookie("client")
      clear_auth_cookie("uid")
    end
end
