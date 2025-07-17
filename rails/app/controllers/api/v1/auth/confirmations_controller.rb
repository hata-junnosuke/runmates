module Api
  module V1
    module Auth
      class ConfirmationsController < DeviseTokenAuth::ConfirmationsController
        # GET /api/v1/auth/confirmation
        def show
          @resource = resource_class.confirm_by_token(params[:confirmation_token])

          if @resource.errors.empty?
            # メール確認が成功したらウェルカムメールを送信
            UserMailer.welcome_email(@resource).deliver_later

            # 確認成功のレスポンス
            render json: {
              success: true,
              message: "メールアドレスの確認が完了しました。",
              data: @resource,
            }
          else
            render json: {
              success: false,
              errors: @resource.errors.full_messages,
            }, status: :unprocessable_entity
          end
        end
      end
    end
  end
end
