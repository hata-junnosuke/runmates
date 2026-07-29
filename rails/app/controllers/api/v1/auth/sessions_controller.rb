class Api::V1::Auth::SessionsController < DeviseTokenAuth::SessionsController
  def create
    # 親クラスのcreateを呼び出す
    super do |resource|
      # メール確認チェック
      if resource && !resource.confirmed?
        # 認証は成功したが確認が済んでいない場合
        sign_out(resource)
        render json: {
          success: false,
          errors: ["メールアドレスの確認が完了していません。確認メールをご確認ください。"],
        }, status: :unauthorized
        return
      end
    end
  end
end
