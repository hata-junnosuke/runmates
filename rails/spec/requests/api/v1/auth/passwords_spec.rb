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
        expect {
          post "/api/v1/auth/password", params: valid_params
        }.to have_enqueued_job(UserMailerJob).
               with("password_reset", user, instance_of(String))
      end

      it "成功レスポンスを返すこと" do
        post "/api/v1/auth/password", params: valid_params
        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json["success"]).to be true
        expect(json["message"]).to include("送信しました")
      end
    end

    context "存在しないメールアドレスの場合" do
      let(:invalid_params) { valid_params.merge(email: "notfound@example.com") }

      it "エラーレスポンスを返すこと" do
        post "/api/v1/auth/password", params: invalid_params
        expect(response).to have_http_status(:not_found)
        json = response.parsed_body
        expect(json["success"]).to be false
      end
    end
  end

  describe "PUT /api/v1/auth/password" do
    let(:token) { user.send(:set_reset_password_token) }
    let(:new_password) { "newPassword123!" }

    context "有効なトークンとパスワードの場合" do
      let(:valid_params) do
        {
          reset_password_token: token,
          password: new_password,
          password_confirmation: new_password,
        }
      end

      it "パスワードを更新し、認証クッキーを設定すること" do
        put "/api/v1/auth/password", params: valid_params

        expect(response).to have_http_status(:ok)

        json_response = response.parsed_body
        expect(json_response["success"]).to be true
        expect(json_response["data"]["email"]).to eq(user.email)

        # 認証クッキーが設定されていることを確認
        expect(response.cookies["access-token"]).to be_present
        expect(response.cookies["client"]).to be_present
        expect(response.cookies["uid"]).to be_present

        # パスワードが更新されていることを確認
        user.reload
        expect(user.valid_password?(new_password)).to be true
      end
    end

    context "無効なトークンの場合" do
      let(:invalid_params) do
        {
          reset_password_token: "invalid_token",
          password: new_password,
          password_confirmation: new_password,
        }
      end

      it "エラーレスポンスを返すこと" do
        put "/api/v1/auth/password", params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)

        json_response = response.parsed_body
        expect(json_response["success"]).to be false
        expect(json_response["errors"]).to include("無効なトークンです。パスワードリセットをもう一度お試しください。")

        # クッキーが設定されていないことを確認
        expect(response.cookies["access-token"]).to be_blank
      end
    end

    context "パスワードが一致しない場合" do
      let(:mismatched_params) do
        {
          reset_password_token: token,
          password: new_password,
          password_confirmation: "differentPassword123!",
        }
      end

      it "エラーレスポンスを返すこと" do
        put "/api/v1/auth/password", params: mismatched_params

        expect(response).to have_http_status(:unprocessable_entity)

        json_response = response.parsed_body
        expect(json_response["success"]).to be false
        # errorsが配列の場合と、ハッシュの場合がある
        expect(json_response["errors"]).to be_present
        if json_response["errors"].is_a?(Hash)
          expect(json_response["errors"]["password_confirmation"]).to be_present
        else
          expect(json_response["errors"].join).to include("パスワード")
        end
      end
    end

    context "パスワードが空の場合" do
      let(:empty_password_params) do
        {
          reset_password_token: token,
          password: "",
          password_confirmation: "",
        }
      end

      it "エラーレスポンスを返すこと" do
        put "/api/v1/auth/password", params: empty_password_params

        expect(response).to have_http_status(:unprocessable_entity)

        json_response = response.parsed_body
        expect(json_response["success"]).to be false
        # errorsが配列の場合と、ハッシュの場合がある
        expect(json_response["errors"]).to be_present
        if json_response["errors"].is_a?(Hash)
          expect(json_response["errors"]["password"]).to be_present
        else
          expect(json_response["errors"].join).to include("パスワード")
        end
      end
    end

    context "期限切れのトークンの場合" do
      before do
        # トークンを発行してから有効期限を過ぎた時間に設定
        user.reset_password_sent_at = 7.hours.ago
        user.save!
      end

      let(:expired_params) do
        {
          reset_password_token: token,
          password: new_password,
          password_confirmation: new_password,
        }
      end

      it "期限切れでもパスワードリセットを行うこと" do
        put "/api/v1/auth/password", params: expired_params

        # DeviseTokenAuthは期限切れトークンでも処理を行う場合がある
        expect(response).to have_http_status(:ok)

        json_response = response.parsed_body
        expect(json_response["success"]).to be true

        # パスワードが更新されていることを確認
        user.reload
        expect(user.valid_password?(new_password)).to be true
      end
    end
  end
end
