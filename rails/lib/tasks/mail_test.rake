# メール設定のテスト送信を行うRakeタスク
require_relative "mail_test_helper"

namespace :mail do
  desc "Send a test email to verify mail configuration"
  task test: :environment do
    email = ENV["TEST_EMAIL"] || "test@example.com"

    puts "Sending test email to: #{email}"
    puts "Current mail delivery method: #{ActionMailer::Base.delivery_method}"
    puts "Mail from address: #{ENV.fetch("MAIL_FROM", "noreply@runmates.net")}"

    begin
      MailTestHelper.send_test_email(email)
      puts "✅ Test email sent successfully!"
    rescue => e
      puts "❌ Failed to send test email:"
      puts "Error: #{e.class} - #{e.message}"
      puts e.backtrace.first(5).join("\n")
    end
  end
end
