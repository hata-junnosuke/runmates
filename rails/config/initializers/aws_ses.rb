# AWS SES V2 configuration for ActionMailer
require "aws-sdk-sesv2"

# カスタムデリバリーメソッドを定義
module ActionMailer
  module SesV2Delivery
    class DeliveryMethod
      def initialize(settings)
        @settings = settings || {}
      end

      def deliver!(mail)
        # AWS SDK設定を構築
        # 環境変数またはIAMロールから認証情報を自動取得
        client_options = {}

        # リージョン設定（設定があれば使用、なければ環境変数、最後にデフォルト）
        client_options[:region] = @settings[:region] || "ap-northeast-1"

        # 明示的な認証情報が設定されている場合のみ使用
        # それ以外は AWS SDK のデフォルトの認証チェーンを使用
        # (環境変数 → IAMロール → ~/.aws/credentials)
        if @settings[:access_key_id] && @settings[:secret_access_key]
          client_options[:credentials] = Aws::Credentials.new(
            @settings[:access_key_id],
            @settings[:secret_access_key],
          )
        end

        ses_client = Aws::SESV2::Client.new(client_options)

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
      rescue Aws::SESV2::Errors::ServiceError => e
        Rails.logger.error "AWS SES Error: #{e.message}"
        raise
      end
    end
  end
end

# ActionMailerにカスタムデリバリーメソッドを登録
ActionMailer::Base.add_delivery_method :ses_v2, ActionMailer::SesV2Delivery::DeliveryMethod, {
  region: "ap-northeast-1",
}
