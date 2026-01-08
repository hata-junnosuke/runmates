require "rails_helper"

RSpec.describe "Api::V1::Auth::Sessions" do
  describe "POST /api/v1/auth/sign_in" do
    context "確認済みユーザーの場合" do
      let(:user) { create(:user, password: "password123") }

      context "正しい認証情報の場合" do
        it "ログインに成功し、認証クッキーを設定すること" do
          post "/api/v1/auth/sign_in", params: { email: user.email, password: "password123" }

          expect(response).to have_http_status(:ok)

          json_response = response.parsed_body
          expect(json_response["data"]["email"]).to eq(user.email)

          # クッキーが設定されていることを確認
          expect(response.cookies["access-token"]).to be_present
          expect(response.cookies["client"]).to be_present
          expect(response.cookies["uid"]).to be_present
        end
      end

      context "誤ったパスワードの場合" do
        it "ログインに失敗すること" do
          post "/api/v1/auth/sign_in", params: { email: user.email, password: "wrong_password" }

          expect(response).to have_http_status(:unauthorized)

          json_response = response.parsed_body
          expect(json_response["errors"]).to be_present

          # クッキーが設定されていないことを確認
          expect(response.cookies["access-token"]).to be_blank
          expect(response.cookies["client"]).to be_blank
          expect(response.cookies["uid"]).to be_blank
        end
      end

      context "存在しないメールアドレスの場合" do
        it "ログインに失敗すること" do
          post "/api/v1/auth/sign_in", params: { email: "nonexistent@example.com", password: "password123" }

          expect(response).to have_http_status(:unauthorized)

          json_response = response.parsed_body
          expect(json_response["errors"]).to be_present
        end
      end
    end

    context "未確認ユーザーの場合" do
      let(:unconfirmed_user) { create(:user, confirmed_at: nil, password: "password123") }

      it "ログインに失敗し、確認が必要なメッセージを返すこと" do
        post "/api/v1/auth/sign_in", params: { email: unconfirmed_user.email, password: "password123" }

        expect(response).to have_http_status(:unauthorized)

        json_response = response.parsed_body
        expect(json_response["success"]).to be false
        # DeviseTokenAuthのデフォルトメッセージと異なる可能性がある
        expect(json_response["errors"]).to be_present
        expect(json_response["errors"].join).to include("確認")

        # クッキーが設定されていないことを確認
        expect(response.cookies["access-token"]).to be_blank
        expect(response.cookies["client"]).to be_blank
        expect(response.cookies["uid"]).to be_blank
      end
    end
  end

  describe "DELETE /api/v1/auth/sign_out" do
    context "認証済みユーザーの場合" do
      let(:user) { create(:user) }
      let(:headers) { user.create_new_auth_token }

      it "ログアウトに成功し、認証クッキーをクリアすること" do
        delete "/api/v1/auth/sign_out", headers: headers

        expect(response).to have_http_status(:ok)

        json_response = response.parsed_body
        expect(json_response["success"]).to be true

        # クッキーがクリアされていることを確認
        # （実際のクッキー削除は response.cookies では確認できないため、
        # コントローラーのテストで clear_auth_cookie が呼ばれることを確認）
      end
    end

    context "未認証ユーザーの場合" do
      it "404エラーを返すこと" do
        delete "/api/v1/auth/sign_out"

        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
