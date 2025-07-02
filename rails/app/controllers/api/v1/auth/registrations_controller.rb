class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  include AuthCookieHelper

  def create
    super do |resource|
      set_auth_cookies_from_headers if resource.persisted?
    end
  end

  private

    def set_auth_cookies_from_headers
      set_auth_cookie(:access_token, response.headers["access-token"])
      set_auth_cookie(:client, response.headers["client"])
      set_auth_cookie(:uid, response.headers["uid"])
    end
end
