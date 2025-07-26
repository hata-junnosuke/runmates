# AWS SES V2 configuration for ActionMailer
require "aws-sdk-sesv2"

# カスタムデリバリーメソッドを定義
module ActionMailer
  module SesV2Delivery
    class DeliveryMethod
      def initialize(settings)
        @settings = settings
      end

      def deliver!(mail)
        ses_client = Aws::SESV2::Client.new(@settings)

        ses_client.send_email(
          from_email_address: mail.from.first,
          destination: {
            to_addresses: mail.to,
            cc_addresses: mail.cc || [],
            bcc_addresses: mail.bcc || [],
          },
          content: {
            raw: {
              data: mail.to_s,
            },
          },
        )
      end
    end
  end
end

# ActionMailerにカスタムデリバリーメソッドを登録
ActionMailer::Base.add_delivery_method :ses_v2, ActionMailer::SesV2Delivery::DeliveryMethod
