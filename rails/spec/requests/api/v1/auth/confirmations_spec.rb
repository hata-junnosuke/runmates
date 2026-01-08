require "rails_helper"

RSpec.describe "Api::V1::Auth::Confirmations" do
  describe "GET /api/v1/auth/confirmation" do
    context "有効な確認トークンの場合" do
      let(:user) { create(:user, confirmed_at: nil) }
      let(:confirmation_token) { user.confirmation_token }

      it "メールアドレスを確認し、ウェルカムメールを送信すること" do
        expect {
          get "/api/v1/auth/confirmation", params: { confirmation_token: confirmation_token }
        }.to have_enqueued_job(UserMailerJob).with("welcome_email", user)

        expect(response).to have_http_status(:ok)

        json_response = response.parsed_body
        expect(json_response["success"]).to be true
        expect(json_response["message"]).to eq("メールアドレスの確認が完了しました。")
        expect(json_response["data"]["email"]).to eq(user.email)

        # ユーザーが確認済みになっていることを確認
        user.reload
        expect(user.confirmed?).to be true
      end
    end

    context "無効な確認トークンの場合" do
      it "エラーレスポンスを返すこと" do
        get "/api/v1/auth/confirmation", params: { confirmation_token: "invalid_token" }

        expect(response).to have_http_status(:unprocessable_content)

        json_response = response.parsed_body
        expect(json_response["success"]).to be false
        expect(json_response["errors"]).to be_present
      end
    end

    context "既に確認済みのユーザーの場合" do
      let(:confirmed_user) { create(:user) } # factoryでconfirmed_at設定済み
      let(:confirmation_token) { confirmed_user.confirmation_token }

      it "エラーレスポンスを返すこと" do
        get "/api/v1/auth/confirmation", params: { confirmation_token: confirmation_token }

        expect(response).to have_http_status(:unprocessable_content)

        json_response = response.parsed_body
        expect(json_response["success"]).to be false
        expect(json_response["errors"]).to be_present
        expect(json_response["errors"].first).to include("パスワード確認用トークン")
      end
    end

    context "期限切れの確認トークンの場合" do
      let(:user) { create(:user, confirmed_at: nil, confirmation_sent_at: 4.days.ago) }
      let(:confirmation_token) { user.confirmation_token }

      it "期限切れでも確認処理を行うこと" do
        get "/api/v1/auth/confirmation", params: { confirmation_token: confirmation_token }

        # DeviseTokenAuthは期限切れトークンでも処理を行う場合がある
        expect(response).to have_http_status(:ok)

        json_response = response.parsed_body
        expect(json_response["success"]).to be true

        # ユーザーが確認済みになっていることを確認
        user.reload
        expect(user.confirmed?).to be true
      end
    end
  end
end
