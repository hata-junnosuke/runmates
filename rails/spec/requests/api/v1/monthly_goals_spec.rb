require "rails_helper"

RSpec.describe "Api::V1::MonthlyGoals" do
  let(:user) { create(:user) }
  let(:headers) { user.create_new_auth_token }

  describe "GET /api/v1/monthly_goals" do
    context "認証済みユーザーの場合" do
      before do
        create(:monthly_goal, user: user, year: 2024, month: 6)
        create(:monthly_goal, user: user, year: 2024, month: 5)
        create(:monthly_goal, user: user, year: 2023, month: 12)
      end

      it "月次目標一覧を年月の降順で返す" do
        get "/api/v1/monthly_goals", headers: headers, as: :json

        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json.length).to eq(3)
        expect(json[0]["year"]).to eq(2024)
        expect(json[0]["month"]).to eq(6)
      end
    end

    context "未認証ユーザーの場合" do
      it "401を返す" do
        get "/api/v1/monthly_goals", as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
