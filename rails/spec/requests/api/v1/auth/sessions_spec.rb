require "rails_helper"

RSpec.describe "Api::V1::Auth::Sessions" do
  describe "POST /api/v1/auth/sign_in" do
    context "確認済みユーザーの場合" do
      let(:user) { create(:user, password: "password123") }

      context "正しい認証情報の場合" do
        it "ログインに成功し、認証トークンをヘッダーで返すこと" do
          post "/api/v1/auth/sign_in", params: { email: user.email, password: "password123" }, as: :json

          expect(response).to have_http_status(:ok)

          json_response = response.parsed_body
          expect(json_response["data"]["email"]).to eq(user.email)

          # 認証トークンがレスポンスヘッダーで返ることを確認（クッキー発行はNext.js側の責務）
          expect(response.headers["access-token"]).to be_present
          expect(response.headers["client"]).to be_present
          expect(response.headers["uid"]).to be_present
        end

        it "ログイン1回につき認証トークンを1本だけ発行すること" do
          expect {
            post "/api/v1/auth/sign_in", params: { email: user.email, password: "password123" }, as: :json
          }.to change { user.reload.tokens.keys.size }.from(0).to(1)
        end
      end

      context "誤ったパスワードの場合" do
        it "ログインに失敗すること" do
          post "/api/v1/auth/sign_in", params: { email: user.email, password: "wrong_password" }, as: :json

          expect(response).to have_http_status(:unauthorized)

          json_response = response.parsed_body
          expect(json_response["errors"]).to be_present

          # 認証トークンがヘッダーで返らないことを確認
          expect(response.headers["access-token"]).to be_blank
          expect(response.headers["client"]).to be_blank
          expect(response.headers["uid"]).to be_blank
        end
      end

      context "存在しないメールアドレスの場合" do
        it "ログインに失敗すること" do
          post "/api/v1/auth/sign_in", params: { email: "nonexistent@example.com", password: "password123" }, as: :json

          expect(response).to have_http_status(:unauthorized)

          json_response = response.parsed_body
          expect(json_response["errors"]).to be_present
        end
      end
    end

    context "未確認ユーザーの場合" do
      let(:unconfirmed_user) { create(:user, confirmed_at: nil, password: "password123") }

      it "ログインに失敗し、確認が必要なメッセージを返すこと" do
        post "/api/v1/auth/sign_in", params: { email: unconfirmed_user.email, password: "password123" }, as: :json

        expect(response).to have_http_status(:unauthorized)

        json_response = response.parsed_body
        expect(json_response["success"]).to be false
        # DeviseTokenAuthのデフォルトメッセージと異なる可能性がある
        expect(json_response["errors"]).to be_present
        expect(json_response["errors"].join).to include("確認")

        # 認証トークンがヘッダーで返らないことを確認
        expect(response.headers["access-token"]).to be_blank
        expect(response.headers["client"]).to be_blank
        expect(response.headers["uid"]).to be_blank
      end
    end
  end

  describe "DELETE /api/v1/auth/sign_out" do
    context "認証済みユーザーの場合" do
      let(:user) { create(:user) }
      let(:headers) { user.create_new_auth_token }

      it "ログアウトに成功し、認証トークンを失効させること" do
        headers

        expect {
          delete "/api/v1/auth/sign_out", headers: headers, as: :json
        }.to change { user.reload.tokens.keys.size }.from(1).to(0)

        expect(response).to have_http_status(:ok)

        json_response = response.parsed_body
        expect(json_response["success"]).to be true
      end
    end

    context "未認証ユーザーの場合" do
      it "404エラーを返すこと" do
        delete "/api/v1/auth/sign_out", as: :json

        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
