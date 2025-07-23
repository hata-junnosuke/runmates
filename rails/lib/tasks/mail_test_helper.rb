# メールテスト用のヘルパーモジュール
module MailTestHelper
  def self.send_test_email(email)
    mail = ActionMailer::Base.mail(
      to: email,
      from: ENV.fetch("MAIL_FROM", "noreply@runmates.net"),
      subject: "[Runmates] Test Email - #{Time.current}",
      body: test_email_body,
    )
    mail.deliver_now
  end

  def self.test_email_body
    <<~BODY
      This is a test email from Runmates application.

      Environment: #{Rails.env}
      Time: #{Time.current}
      Delivery Method: #{ActionMailer::Base.delivery_method}

      If you received this email, your mail configuration is working correctly!
    BODY
  end

  def self.print_aws_config
    puts "\n=== AWS SES Configuration ==="
    puts "AWS Region: #{ENV.fetch("AWS_REGION", nil)}"
    puts "AWS Access Key ID: #{ENV["AWS_ACCESS_KEY_ID"].present? ? "***#{ENV["AWS_ACCESS_KEY_ID"].last(4)}" : "NOT SET"}"
    puts "AWS Secret Access Key: #{ENV["AWS_SECRET_ACCESS_KEY"].present? ? "***SET***" : "NOT SET"}"
  end
end
