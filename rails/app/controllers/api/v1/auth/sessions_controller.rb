class Api::V1::Auth::SessionsController < DeviseTokenAuth::SessionsController
  # rubocop:disable Rails/LexicallyScopedActionFilter
  after_action :set_auth_cookies, only: [:create]
  after_action :clear_auth_cookies, only: [:destroy]
  # rubocop:enable Rails/LexicallyScopedActionFilter

  private

    def set_auth_cookies
      if @resource&.persisted? && response.status == 200
        auth_headers_data = @resource.create_new_auth_token
        set_cookie(:access_token, auth_headers_data["access-token"])
        set_cookie(:client, auth_headers_data["client"])
        set_cookie(:uid, auth_headers_data["uid"])
      end
    end

    def clear_auth_cookies
      set_cookie(:access_token, "", expires: 1.day.ago)
      set_cookie(:client, "", expires: 1.day.ago)
      set_cookie(:uid, "", expires: 1.day.ago)
    end

    def set_cookie(name, value, expires: 2.weeks.from_now)
      response.set_cookie(name, {
        value: value,
        httponly: true,
        secure: Rails.env.production?,
        # same_site: Rails.env.production? ? :none : :lax,
        # domain: Rails.env.production? ? ".runmates.net" : nil,
        # vercelの一時設定
        same_site: :none,
        domain: Rails.env.production? ? ".vercel.app" : nil,
        expires: expires,
        path: "/",
      })
    end
end
