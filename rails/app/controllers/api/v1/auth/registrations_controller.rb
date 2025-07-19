class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  include AuthCookieHelper

  def create
    build_resource

    if @resource.blank?
      raise DeviseTokenAuth::Errors::NoResourceDefinedError, "#{self.class.name} #build_resource does not define @resource, " \
                                                             "execution stopped."
    end

    # 登録フォームのパラメータを保存
    @resource.assign_attributes(sign_up_params)

    # 保存処理
    if @resource.save
      # 確認メールを送信
      @resource.send_confirmation_instructions

      render json: {
        status: "success",
        message: "確認メールを送信しました。メールを確認してアカウントを有効化してください。",
        data: @resource,
      }
    else
      clean_up_passwords @resource
      render json: {
        status: "error",
        errors: @resource.errors.full_messages,
      }, status: :unprocessable_entity
    end
  end

  private

    def set_auth_cookies_from_headers
      set_auth_cookie("access-token", response.headers["access-token"])
      set_auth_cookie("client", response.headers["client"])
      set_auth_cookie("uid", response.headers["uid"])
    end
end
