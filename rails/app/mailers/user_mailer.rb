class UserMailer < ApplicationMailer
  # メールアドレス確認メール
  def confirmation_email(user, confirmation_token)
    @user = user
    @confirmation_token = confirmation_token
    @app_name = "Runmates"
    @confirmation_url = "#{ENV.fetch("NEXT_PUBLIC_BASE_URL", "http://localhost:8000")}/confirm_email?token=#{@confirmation_token}"

    mail(
      to: @user.email,
      subject: "【#{@app_name}】メールアドレスの確認をお願いします",
    )
  end

  # ウェルカムメール（メール確認完了時）
  def welcome_email(user)
    @user = user
    @app_name = "Runmates"

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
    @reset_url = "#{ENV.fetch("NEXT_PUBLIC_BASE_URL", "http://localhost:8000")}/reset_password?token=#{@reset_password_token}"

    mail(
      to: @user.email,
      subject: "【#{@app_name}】パスワードリセットのご案内",
    )
  end
end
