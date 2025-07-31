class UserMailer < ApplicationMailer
  # メールアドレス確認メール
  def confirmation_email(user, confirmation_token)
    @user = user
    @confirmation_token = confirmation_token
    @app_name = "Runmates"
    @confirmation_url = "#{base_url}/confirm_email?token=#{@confirmation_token}"

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
    @reset_url = "#{base_url}/reset_password?token=#{@reset_password_token}"

    mail(
      to: @user.email,
      subject: "【#{@app_name}】パスワードリセットのご案内",
    )
  end

  private

    def base_url
      if Rails.env.production?
        "https://runmates.net"
      else
        "http://localhost:8000"
      end
    end
end
