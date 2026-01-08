require "rails_helper"

RSpec.describe "Api::V1::CurrentMonthlyGoal" do
  let(:user) { create(:user) }
  let(:headers) { user.create_new_auth_token }
  let(:current_year) { Date.current.year }
  let(:current_month) { Date.current.month }

  describe "GET /api/v1/current_monthly_goal" do
    context "認証済みユーザーの場合" do
      context "今月の目標が存在する場合" do
        let!(:monthly_goal) {
          create(:monthly_goal, user: user, year: current_year, month: current_month, distance_goal: 100.0)
        }

        it "今月の目標を返すこと" do
          get "/api/v1/current_monthly_goal", headers: headers

          expect(response).to have_http_status(:ok)

          json_response = response.parsed_body
          expect(json_response["id"]).to eq(monthly_goal.id)
          expect(json_response["year"]).to eq(current_year)
          expect(json_response["month"]).to eq(current_month)
          expect(json_response["distance_goal"]).to eq("100.0")
        end
      end

      context "今月の目標が存在しない場合" do
        it "デフォルト値を含むオブジェクトを返すこと" do
          get "/api/v1/current_monthly_goal", headers: headers

          expect(response).to have_http_status(:ok)

          json_response = response.parsed_body
          expect(json_response["id"]).to be_nil
          expect(json_response["year"]).to eq(current_year)
          expect(json_response["month"]).to eq(current_month)
          expect(json_response["distance_goal"]).to be_nil
          expect(json_response["created_at"]).to be_nil
          expect(json_response["updated_at"]).to be_nil
        end
      end

      context "過去月の目標のみ存在する場合" do
        let!(:past_goal) {
          create(:monthly_goal, :for_previous_month, :with_medium_low_goal, user: user)
        }

        it "今月のデフォルト値を返すこと" do
          get "/api/v1/current_monthly_goal", headers: headers

          expect(response).to have_http_status(:ok)

          json_response = response.parsed_body
          expect(json_response["id"]).to be_nil
          expect(json_response["year"]).to eq(current_year)
          expect(json_response["month"]).to eq(current_month)
          expect(json_response["distance_goal"]).to be_nil
        end
      end
    end

    context "未認証ユーザーの場合" do
      it "401エラーを返すこと" do
        get "/api/v1/current_monthly_goal"

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /api/v1/current_monthly_goal" do
    context "認証済みユーザーの場合" do
      context "新規作成の場合" do
        it "今月の目標を作成すること" do
          expect {
            post "/api/v1/current_monthly_goal",
                 params: { monthly_goal: { year: current_year, month: current_month, distance_goal: 120.0 } },
                 headers: headers
          }.to change { MonthlyGoal.count }.by(1)

          expect(response).to have_http_status(:created)

          json_response = response.parsed_body
          expect(json_response["year"]).to eq(current_year)
          expect(json_response["month"]).to eq(current_month)
          expect(json_response["distance_goal"]).to eq("120.0")
        end

        it "年月を省略した場合は今月の目標を作成すること" do
          expect {
            post "/api/v1/current_monthly_goal",
                 params: { monthly_goal: { distance_goal: 80.0 } },
                 headers: headers
          }.to change { MonthlyGoal.count }.by(1)

          expect(response).to have_http_status(:created)

          json_response = response.parsed_body
          expect(json_response["year"]).to eq(current_year)
          expect(json_response["month"]).to eq(current_month)
          expect(json_response["distance_goal"]).to eq("80.0")
        end
      end

      context "既存の目標を更新する場合" do
        let!(:existing_goal) {
          create(:monthly_goal, :with_low_goal, user: user, year: current_year, month: current_month)
        }

        it "既存の目標を更新すること" do
          expect {
            post "/api/v1/current_monthly_goal",
                 params: { monthly_goal: { year: current_year, month: current_month, distance_goal: 150.0 } },
                 headers: headers
          }.not_to change { MonthlyGoal.count }

          expect(response).to have_http_status(:ok)

          json_response = response.parsed_body
          expect(json_response["id"]).to eq(existing_goal.id)
          expect(json_response["distance_goal"]).to eq("150.0")
        end
      end

      context "無効なパラメータの場合" do
        it "エラーを返すこと" do
          post "/api/v1/current_monthly_goal",
               params: { monthly_goal: { year: current_year, month: current_month, distance_goal: 0 } },
               headers: headers

          expect(response).to have_http_status(:unprocessable_content)

          json_response = response.parsed_body
          expect(json_response["errors"]).to be_present
        end
      end
    end

    context "未認証ユーザーの場合" do
      it "401エラーを返すこと" do
        post "/api/v1/current_monthly_goal",
             params: { monthly_goal: { distance_goal: 100.0 } }

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
