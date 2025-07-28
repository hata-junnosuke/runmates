class UserMailerJob < ApplicationJob
  queue_as :mailers

  # ウェルカムメール送信
  def perform(action, *args)
    case action
    when "welcome_email"
      user = args[0]
      UserMailer.welcome_email(user).deliver_now
    when "password_reset"
      user = args[0]
      token = args[1]
      UserMailer.password_reset(user, token).deliver_now
    when "confirmation_email"
      user = args[0]
      token = args[1]
      UserMailer.confirmation_email(user, token).deliver_now
    else
      Rails.logger.error "Unknown mailer action: #{action}"
    end
  rescue => e
    Rails.logger.error "Failed to send email: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    raise # ジョブを失敗としてマーク
  end
end
