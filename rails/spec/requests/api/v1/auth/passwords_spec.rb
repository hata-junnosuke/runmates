require "rails_helper"

RSpec.describe "Api::V1::Auth::Passwords", type: :request do
  let(:user) { create(:user, email: "test@example.com") }

  describe "POST /api/v1/auth/password" do
    let(:valid_params) do
      {
        email: user.email,
        redirect_url: "http://localhost:8000/reset_password",
      }
    end

    context "存在するメールアドレスの場合" do
      it "パスワードリセットメールを送信すること" do
        expect do
          post "/api/v1/auth/password", params: valid_params
        end.to have_enqueued_job(ActionMailer::MailDeliveryJob).
                 with("UserMailer", "password_reset", "deliver_now", { args: [user, instance_of(String)] })
      end

      it "成功レスポンスを返すこと" do
        post "/api/v1/auth/password", params: valid_params
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["success"]).to be true
        expect(json["message"]).to include("案内")
      end
    end

    context "存在しないメールアドレスの場合" do
      let(:invalid_params) { valid_params.merge(email: "notfound@example.com") }

      it "エラーレスポンスを返すこと" do
        post "/api/v1/auth/password", params: invalid_params
        expect(response).to have_http_status(:not_found)
        json = JSON.parse(response.body)
        expect(json["success"]).to be false
      end
    end
  end

  # パスワードリセットのPUTテストは、DeviseTokenAuthの実装に依存するため
  # 統合テストとして別途実装することを推奨
end
