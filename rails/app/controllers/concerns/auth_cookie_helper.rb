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
      {
        value: value,
        httponly: true,
        secure: Rails.env.production?,
        # サブドメイン間でクッキーを共有し、セキュリティとユーザビリティのバランスを取る
        same_site: :lax,
        # 本番環境ではサブドメイン間でクッキーを共有
        domain: Rails.env.production? ? ".runmates.net" : nil,
        expires: expires,
        path: "/",
      }
    end
end
