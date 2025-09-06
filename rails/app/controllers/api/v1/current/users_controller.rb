class Api::V1::Current::UsersController < Api::V1::BaseController
  before_action :authenticate_user!
  skip_after_action :update_auth_header, only: [:destroy]

  def show
    render json: current_user, serializer: CurrentUserSerializer
  end

  def update
    # メールアドレス変更の場合
    if params[:new_email].present?
      # パスワード確認
      unless params[:password].present? && current_user.valid_password?(params[:password])
        render json: { errors: ["パスワードが正しくありません"] }, status: :unprocessable_entity
        return
      end

      # メールアドレス変更リクエスト
      if current_user.request_email_change(params[:new_email])
        render json: {
          message: "確認メールを送信しました。メールを確認して変更を完了してください。",
          pending_email: current_user.pending_email,
        }, status: :ok
      else
        render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { errors: ["新しいメールアドレスが必要です"] }, status: :unprocessable_entity
    end
  end

  def destroy
    if params[:password].blank?
      render json: { errors: ["パスワードが必要です"] }, status: :unprocessable_entity
      return
    end

    unless current_user.valid_password?(params[:password])
      render json: { errors: ["パスワードが正しくありません"] }, status: :unprocessable_entity
      return
    end

    user_id = current_user.id
    user_email = current_user.email

    ActiveRecord::Base.transaction do
      Rails.logger.info "User deletion initiated for user_id: #{user_id}, email: #{user_email}"

      current_user.destroy!

      Rails.logger.info "User deletion completed for user_id: #{user_id}"
    rescue => e
      Rails.logger.error "User deletion failed for user_id: #{user_id}, error: #{e.message}"
      render json: { errors: ["アカウントの削除に失敗しました"] }, status: :unprocessable_entity
      return
    end

    render json: { message: "アカウントが正常に削除されました" }, status: :ok
  end
end
