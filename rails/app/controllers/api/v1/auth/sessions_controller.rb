class Api::V1::Auth::SessionsController < DeviseTokenAuth::SessionsController
  include AuthCookieHelper

  # rubocop:disable Rails/LexicallyScopedActionFilter
  after_action :set_auth_cookies, only: [:create]
  after_action :clear_auth_cookies, only: [:destroy]
  # rubocop:enable Rails/LexicallyScopedActionFilter

  private

    def set_auth_cookies
      if @resource&.persisted? && response.status == 200
        auth_headers_data = @resource.create_new_auth_token
        set_auth_cookie("access-token", auth_headers_data["access-token"])
        set_auth_cookie("client", auth_headers_data["client"])
        set_auth_cookie("uid", auth_headers_data["uid"])
      end
    end

    def clear_auth_cookies
      clear_auth_cookie("access-token")
      clear_auth_cookie("client")
      clear_auth_cookie("uid")
    end
end
