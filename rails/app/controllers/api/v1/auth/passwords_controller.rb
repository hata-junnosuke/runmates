module Api
  module V1
    module Auth
      class PasswordsController < DeviseTokenAuth::PasswordsController
        include AuthCookieHelper
        
        # パスワードリセットの更新処理をカスタマイズ
        def update
          # まずトークンでユーザーを検索
          reset_password_token = Devise.token_generator.digest(resource_class, :reset_password_token, params[:reset_password_token])
          @resource = resource_class.find_by(reset_password_token: reset_password_token)
          
          if @resource.nil?
            render json: {
              success: false,
              errors: ["無効なトークンです。パスワードリセットをもう一度お試しください。"]
            }, status: :unprocessable_entity
            return
          end
          
          # パスワードを更新
          if @resource.reset_password(params[:password], params[:password_confirmation])
            @resource.allow_password_change = false
            @resource.save!
            
            # 認証トークンを生成
            token_data = @resource.create_new_auth_token
            
            # クッキーに認証情報を設定
            set_auth_cookie("access-token", token_data["access-token"])
            set_auth_cookie("client", token_data["client"])
            set_auth_cookie("uid", token_data["uid"])
            
            # レスポンスヘッダーにも設定
            response.headers.merge!(token_data)
            
            render json: {
              success: true,
              data: {
                id: @resource.id,
                email: @resource.email,
                uid: @resource.uid,
                provider: @resource.provider,
                name: @resource.name,
                confirmed: @resource.confirmed?
              },
              message: "パスワードが正常に更新されました。"
            }
          else
            render json: {
              success: false,
              errors: @resource.errors.full_messages
            }, status: :unprocessable_entity
          end
        end
      end
    end
  end
end