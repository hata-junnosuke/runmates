class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  def create
    super do |resource|
      set_auth_cookies_from_headers if resource.persisted?
    end
  end

  private

    def set_auth_cookies_from_headers
      set_cookie(:access_token, response.headers["access-token"])
      set_cookie(:client, response.headers["client"])
      set_cookie(:uid, response.headers["uid"])
    end

    def set_cookie(name, value)
      response.set_cookie(name, {
        value: value,
        httponly: true,
        secure: Rails.env.production?,
        same_site: :lax,
        expires: 2.weeks.from_now,
        path: "/",
      })
    end
end
