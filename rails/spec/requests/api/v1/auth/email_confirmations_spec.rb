require "rails_helper"

RSpec.describe "Api::V1::Auth::EmailConfirmations", type: :request do
  describe "GET /api/v1/auth/email_confirmation" do
    let(:user) { create(:user, email: "old@example.com", confirmed_at: 1.day.ago) }
    let(:new_email) { "new@example.com" }

    context "有効な確認トークンの場合" do
      before do
        user.request_email_change(new_email)
      end

      it "メールアドレスを変更し、成功レスポンスを返すこと" do # rubocop:disable RSpec/ExampleLength
        token = user.instance_variable_get(:@confirmation_token) ||
                SecureRandom.urlsafe_base64(32)
        # トークンを再生成して保存
        user.pending_email_confirmation_token = Devise.token_generator.digest(
          User, :pending_email_confirmation_token, token
        )
        user.save!

        get "/api/v1/auth/email_confirmation", params: { confirmation_token: token }

        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json["success"]).to be true
        expect(json["message"]).to eq("メールアドレスが正常に変更されました")
        expect(json["email"]).to eq(new_email)

        user.reload
        expect(user.email).to eq(new_email)
        expect(user.uid).to eq(new_email)
        expect(user.pending_email).to be_nil
      end
    end

    context "無効な確認トークンの場合" do
      it "エラーレスポンスを返すこと" do
        get "/api/v1/auth/email_confirmation", params: { confirmation_token: "invalid_token" }

        expect(response).to have_http_status(:not_found)
        json = response.parsed_body
        expect(json["success"]).to be false
        expect(json["errors"]).to include("無効な確認トークンです")
      end
    end

    context "トークンが提供されない場合" do
      it "エラーレスポンスを返すこと" do
        get "/api/v1/auth/email_confirmation"

        expect(response).to have_http_status(:bad_request)
        json = response.parsed_body
        expect(json["success"]).to be false
        expect(json["errors"]).to include("確認トークンが必要です")
      end
    end
  end
end
