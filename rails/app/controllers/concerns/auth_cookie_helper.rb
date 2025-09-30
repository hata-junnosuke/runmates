# frozen_string_literal: true

module AuthCookieHelper
  extend ActiveSupport::Concern

  private

    def set_auth_cookie(name, value, expires: 2.weeks.from_now)
      response.set_cookie(name, auth_cookie_options(value, expires))
    end

    def clear_auth_cookie(name)
      set_auth_cookie(name, "", expires: 1.day.ago)
    end

    def auth_cookie_options(value, expires)
      options = {
        value: value,
        httponly: true,
        secure: Rails.env.production?,
        # 本番環境ではクロスサイトリクエストでもクッキーを送信するためnoneに設定
        # 開発環境では同一サイトなのでlaxで十分
        same_site: Rails.env.production? ? :none : :lax,
        # 本番環境ではサブドメイン間でクッキーを共有
        domain: Rails.env.production? ? ".runmates.net" : nil,
        expires: expires,
        path: "/",
      }

      # Partitioned Cookieを無効化（クロスサイトで送信されるようにする）
      # Rails 7.1以降でpartitionedオプションがサポートされている場合のみ設定
      options[:partitioned] = false if Rails.env.production?

      options
    end
end
