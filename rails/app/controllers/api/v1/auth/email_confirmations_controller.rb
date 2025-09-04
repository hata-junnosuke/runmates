class Api::V1::Auth::EmailConfirmationsController < ApplicationController
  include AuthCookieHelper

  def show
    token = params[:confirmation_token]

    if token.blank?
      render json: { success: false, errors: ["確認トークンが必要です"] }, status: :bad_request
      return
    end

    # トークンからユーザーを検索
    digest = Devise.token_generator.digest(User, :pending_email_confirmation_token, token)
    user = User.find_by(pending_email_confirmation_token: digest)

    if user.nil?
      render json: { success: false, errors: ["無効な確認トークンです"] }, status: :not_found
      return
    end

    # メールアドレスを変更
    if user.confirm_email_change(token)
      # uidが変更されたので、クッキーのuidも更新する（ログイン中の場合のみ）
      update_auth_cookies_for_user(user)
      render json: {
        success: true,
        message: "メールアドレスが正常に変更されました",
        email: user.email,
      }, status: :ok
    else
      render json: {
        success: false,
        errors: user.errors.full_messages.presence || ["メールアドレスの変更に失敗しました"],
      }, status: :unprocessable_entity
    end
  end

  private

    def update_auth_cookies_for_user(user)
      # 既存のクッキーから認証トークン情報を取得
      access_token = request.cookies["access-token"]
      client = request.cookies["client"]

      # クッキーに保存されている認証情報が存在する場合のみ更新
      if access_token.present? && client.present?
        # 新しいuidでクッキーを更新
        set_auth_cookie("uid", user.uid)
        # access-tokenとclientは変更不要（同じユーザーのトークンなので）
      end
    end
end
