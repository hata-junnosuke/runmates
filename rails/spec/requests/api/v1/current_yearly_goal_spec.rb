require "rails_helper"

RSpec.describe "Api::V1::CurrentYearlyGoal", type: :request do
  let(:user) { create(:user) }
  let(:headers) { user.create_new_auth_token }
  let(:current_year) { Date.current.year }

  describe "GET /api/v1/current_yearly_goal" do
    context "認証済みユーザーの場合" do
      context "今年の目標が存在する場合" do
        let!(:yearly_goal) { create(:yearly_goal, :with_medium_goal, user: user, year: current_year) }

        it "今年の目標を返すこと" do
          get "/api/v1/current_yearly_goal", headers: headers

          expect(response).to have_http_status(:ok)

          json_response = response.parsed_body
          expect(json_response["id"]).to eq(yearly_goal.id)
          expect(json_response["year"]).to eq(current_year)
          expect(json_response["distance_goal"]).to eq("1000.0")
        end
      end

      context "今年の目標が存在しない場合" do
        it "デフォルト値を含むオブジェクトを返すこと" do
          get "/api/v1/current_yearly_goal", headers: headers

          expect(response).to have_http_status(:ok)

          json_response = response.parsed_body
          expect(json_response["id"]).to be_nil
          expect(json_response["year"]).to eq(current_year)
          expect(json_response["distance_goal"]).to eq(500.0)
          expect(json_response["created_at"]).to be_nil
          expect(json_response["updated_at"]).to be_nil
        end
      end

      context "過去年の目標のみ存在する場合" do
        let!(:past_goal) { create(:yearly_goal, :for_previous_year, :with_medium_low_goal_alt, user: user) }

        it "今年のデフォルト値を返すこと" do
          get "/api/v1/current_yearly_goal", headers: headers

          expect(response).to have_http_status(:ok)

          json_response = response.parsed_body
          expect(json_response["id"]).to be_nil
          expect(json_response["year"]).to eq(current_year)
          expect(json_response["distance_goal"]).to eq(500.0)
        end
      end
    end

    context "未認証ユーザーの場合" do
      it "401エラーを返すこと" do
        get "/api/v1/current_yearly_goal"

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /api/v1/current_yearly_goal" do
    context "認証済みユーザーの場合" do
      context "新規作成の場合" do
        it "今年の目標を作成すること" do
          expect {
            post "/api/v1/current_yearly_goal",
                 params: { yearly_goal: { year: current_year, distance_goal: 1200.0 } },
                 headers: headers
          }.to change { YearlyGoal.count }.by(1)

          expect(response).to have_http_status(:created)

          json_response = response.parsed_body
          expect(json_response["year"]).to eq(current_year)
          expect(json_response["distance_goal"]).to eq("1200.0")
        end

        it "年を省略した場合は今年の目標を作成すること" do
          expect {
            post "/api/v1/current_yearly_goal",
                 params: { yearly_goal: { distance_goal: 800.0 } },
                 headers: headers
          }.to change { YearlyGoal.count }.by(1)

          expect(response).to have_http_status(:created)

          json_response = response.parsed_body
          expect(json_response["year"]).to eq(current_year)
          expect(json_response["distance_goal"]).to eq("800.0")
        end
      end

      context "既存の目標を更新する場合" do
        let!(:existing_goal) { create(:yearly_goal, :with_medium_low_goal, user: user, year: current_year) }

        it "既存の目標を更新すること" do
          expect {
            post "/api/v1/current_yearly_goal",
                 params: { yearly_goal: { year: current_year, distance_goal: 1500.0 } },
                 headers: headers
          }.not_to change { YearlyGoal.count }

          expect(response).to have_http_status(:ok)

          json_response = response.parsed_body
          expect(json_response["id"]).to eq(existing_goal.id)
          expect(json_response["distance_goal"]).to eq("1500.0")
        end
      end

      context "無効なパラメータの場合" do
        it "エラーを返すこと" do
          post "/api/v1/current_yearly_goal",
               params: { yearly_goal: { year: current_year, distance_goal: 0 } },
               headers: headers

          expect(response).to have_http_status(:unprocessable_entity)

          json_response = response.parsed_body
          expect(json_response["errors"]).to be_present
        end
      end
    end

    context "未認証ユーザーの場合" do
      it "401エラーを返すこと" do
        post "/api/v1/current_yearly_goal",
             params: { yearly_goal: { distance_goal: 1000.0 } }

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
