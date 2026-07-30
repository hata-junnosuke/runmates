require "rails_helper"

RSpec.describe "Api::V1 認証方式" do
  let(:user) { create(:user) }
  let(:auth_headers) { user.create_new_auth_token }

  context "access-tokenヘッダーを送った場合" do
    it "認証が通る" do
      get "/api/v1/running_records", headers: auth_headers, as: :json

      expect(response).to have_http_status(:ok)
    end
  end

  context "認証Cookieだけを送った場合" do
    it "認証されず401を返す（Cookieの運搬はNext.jsの責務であり、Railsは読まない）" do
      cookies["access-token"] = auth_headers["access-token"]
      cookies["client"] = auth_headers["client"]
      cookies["uid"] = auth_headers["uid"]

      get "/api/v1/running_records", as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
