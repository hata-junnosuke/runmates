class Api::V1::Auth::SessionsController < DeviseTokenAuth::SessionsController
  # rubocop:disable Rails/LexicallyScopedActionFilter
  after_action :set_auth_cookies, only: [:create]
  after_action :clear_auth_cookies, only: [:destroy]
  # rubocop:enable Rails/LexicallyScopedActionFilter

  private

    def set_auth_cookies
      Rails.logger.info "Debug: @resource: #{@resource.inspect}"
      Rails.logger.info "Debug: response status: #{response.status}"

      if @resource&.persisted? && response.status == 200
        Rails.logger.info "Debug: Setting cookies from @resource"
        auth_headers_data = @resource.create_new_auth_token
        Rails.logger.info "Debug: auth_headers_data: #{auth_headers_data.inspect}"
        set_cookie(:access_token, auth_headers_data["access-token"])
        set_cookie(:client, auth_headers_data["client"])
        set_cookie(:uid, auth_headers_data["uid"])
        Rails.logger.info "Debug: Cookies set from @resource"
      else
        Rails.logger.info "Debug: @resource not persisted or wrong status"
      end
    end

    def clear_auth_cookies
      Rails.logger.info "Debug: Clearing cookies"
      set_cookie(:access_token, "", expires: 1.day.ago)
      set_cookie(:client, "", expires: 1.day.ago)
      set_cookie(:uid, "", expires: 1.day.ago)
      Rails.logger.info "Debug: Cookies cleared"
    end

    def set_cookie(name, value, expires: 2.weeks.from_now)
      response.set_cookie(name, {
        value: value,
        httponly: true,
        secure: Rails.env.production?,
        same_site: :lax,
        expires: expires,
        path: "/",
      })
    end
end
