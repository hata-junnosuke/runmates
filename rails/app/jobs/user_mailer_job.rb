class UserMailerJob < ApplicationJob
  queue_as :mailers

  def perform(action, *args)
    send_mail(action, args)
  rescue => e
    handle_error(e)
  end

  private

    def send_mail(action, args)
      mailer = mailer_for(action, args)
      if mailer
        mailer.deliver_now
      else
        Rails.logger.error "Unknown mailer action: #{action}"
      end
    end

    def mailer_for(action, args)
      case action
      when "welcome_email"
        UserMailer.welcome_email(args[0])
      when "password_reset"
        UserMailer.password_reset(args[0], args[1])
      when "confirmation_email"
        UserMailer.confirmation_email(args[0], args[1])
      when "email_change"
        UserMailer.email_change(args[0], args[1])
      when "email_changed"
        UserMailer.email_changed(args[0])
      end
    end

    def handle_error(error)
      Rails.logger.error "Failed to send email: #{error.message}"
      Rails.logger.error error.backtrace.join("\n")
      raise # ジョブを失敗としてマーク
    end
end
