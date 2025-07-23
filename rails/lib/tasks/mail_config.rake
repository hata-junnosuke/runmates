# メール設定の確認を行うRakeタスク
require_relative "mail_test_helper"

namespace :mail do
  desc "Check current mail configuration"
  task config: :environment do
    puts "=== Current Mail Configuration ==="
    puts "Environment: #{Rails.env}"
    puts "Delivery Method: #{ActionMailer::Base.delivery_method}"
    puts "Default URL Options: #{ActionMailer::Base.default_url_options}"
    puts "Default From: #{ENV.fetch("MAIL_FROM", "noreply@runmates.net")}"

    MailTestHelper.print_aws_config if Rails.env.production? && ENV["AWS_SES_ENABLED"] == "true"

    if Rails.env.development?
      puts "\n=== Development Configuration ==="
      puts "Letter Opener Web URL: http://localhost:3000/letter_opener"
    end
  end
end
