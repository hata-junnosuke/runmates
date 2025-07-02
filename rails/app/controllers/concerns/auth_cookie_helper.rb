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
      # Vercel環境対応: SameSite=noneを設定、domainはnilで現在のドメインを使用
      same_site: Rails.env.production? ? :none : :lax,
      domain: nil,
      expires: expires,
      path: "/",
    }
  end
end