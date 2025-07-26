module Api
  module V1
    module Auth
      class PasswordsController < DeviseTokenAuth::PasswordsController
        include AuthCookieHelper

        # パスワードリセットの更新処理をカスタマイズ
        def update
          find_resource_by_token
          return if performed?

          update_password
        end

        private

          def find_resource_by_token
            reset_password_token = Devise.token_generator.digest(
              resource_class,
              :reset_password_token,
              params[:reset_password_token],
            )
            @resource = resource_class.find_by(reset_password_token: reset_password_token)

            return if @resource.present?

            render json: {
              success: false,
              errors: ["無効なトークンです。パスワードリセットをもう一度お試しください。"],
            }, status: :unprocessable_entity
          end

          def update_password
            if @resource.reset_password(params[:password], params[:password_confirmation])
              handle_successful_password_reset
            else
              handle_failed_password_reset
            end
          end

          def handle_successful_password_reset
            @resource.allow_password_change = false
            @resource.save!

            token_data = @resource.create_new_auth_token
            apply_auth_cookies_and_headers(token_data)

            render json: success_response_data
          end

          def handle_failed_password_reset
            render json: {
              success: false,
              errors: @resource.errors.full_messages,
            }, status: :unprocessable_entity
          end

          def apply_auth_cookies_and_headers(token_data)
            set_auth_cookie("access-token", token_data["access-token"])
            set_auth_cookie("client", token_data["client"])
            set_auth_cookie("uid", token_data["uid"])
            response.headers.merge!(token_data)
          end

          def success_response_data
            {
              success: true,
              data: {
                id: @resource.id,
                email: @resource.email,
                uid: @resource.uid,
                provider: @resource.provider,
                name: @resource.name,
                confirmed: @resource.confirmed?,
              },
              message: "パスワードが正常に更新されました。",
            }
          end
      end
    end
  end
end
