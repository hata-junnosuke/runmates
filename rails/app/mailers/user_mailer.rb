class UserMailer < ApplicationMailer
  # メールアドレス確認メール
  def confirmation_email(user, confirmation_token)
    @user = user
    @confirmation_token = confirmation_token
    @app_name = "Runmates"
    @confirmation_url = "#{base_url}/confirm-email?token=#{@confirmation_token}"

    mail(
      to: @user.email,
      subject: "【#{@app_name}】メールアドレスの確認をお願いします",
    )
  end

  # ウェルカムメール（メール確認完了時）
  def welcome_email(user)
    @user = user
    @app_name = "Runmates"
    @app_url = base_url

    mail(
      to: @user.email,
      subject: "【#{@app_name}】会員登録が完了しました",
    )
  end

  # パスワードリセットメール
  def password_reset(user, reset_password_token)
    @user = user
    @reset_password_token = reset_password_token
    @app_name = "Runmates"
    @reset_url = "#{base_url}/reset-password?token=#{@reset_password_token}"

    mail(
      to: @user.email,
      subject: "【#{@app_name}】パスワードリセットのご案内",
    )
  end

  # メールアドレス変更確認メール
  def email_change(user, confirmation_token)
    @user = user
    @confirmation_token = confirmation_token
    @app_name = "Runmates"
    @new_email = user.pending_email
    @confirmation_url = "#{base_url}/confirm-email-change?token=#{@confirmation_token}"

    mail(
      to: @new_email,
      subject: "【#{@app_name}】メールアドレス変更の確認",
    )
  end

  # メールアドレス変更完了通知
  def email_changed(user)
    @user = user
    @app_name = "Runmates"

    mail(
      to: @user.email,
      subject: "【#{@app_name}】メールアドレスが変更されました",
    )
  end

  private

    def base_url
      # フロントエンドのURL（リダイレクト先）
      # 環境別のcredentialsから取得
      Rails.application.credentials.dig(Rails.env.to_sym, :frontend_url) ||
        "http://localhost:8000"
    end
end
