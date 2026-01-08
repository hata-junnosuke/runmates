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
        get "/api/v1/monthly_goals", headers: headers

        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json.length).to eq(3)
        expect(json[0]["year"]).to eq(2024)
        expect(json[0]["month"]).to eq(6)
      end
    end

    context "未認証ユーザーの場合" do
      it "401を返す" do
        get "/api/v1/monthly_goals"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "GET /api/v1/monthly_goals/:id" do
    let!(:monthly_goal) { create(:monthly_goal, user: user) }

    context "認証済みユーザーの場合" do
      it "指定された月次目標を返す" do
        get "/api/v1/monthly_goals/#{monthly_goal.id}", headers: headers

        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json["id"]).to eq(monthly_goal.id)
        expect(json["distance_goal"]).to eq(monthly_goal.distance_goal.to_s)
      end

      it "他のユーザーの目標にはアクセスできない" do
        other_user = create(:user)
        other_goal = create(:monthly_goal, user: other_user)

        get "/api/v1/monthly_goals/#{other_goal.id}", headers: headers
        expect(response.status).to be_in([404, 401, 403])
      end
    end

    context "未認証ユーザーの場合" do
      it "401を返す" do
        get "/api/v1/monthly_goals/#{monthly_goal.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /api/v1/monthly_goals" do
    let(:valid_params) do
      {
        monthly_goal: {
          year: 2024,
          month: 6,
          distance_goal: 100.0,
        },
      }
    end

    context "認証済みユーザーの場合" do
      context "有効なパラメータの場合" do
        it "新しい月次目標を作成する" do
          expect {
            post "/api/v1/monthly_goals", params: valid_params, headers: headers
          }.to change { MonthlyGoal.count }.by(1)

          expect(response).to have_http_status(:created)
          json = response.parsed_body
          expect(json["distance_goal"]).to eq("100.0")
        end
      end

      context "無効なパラメータの場合" do
        let(:invalid_params) do
          {
            monthly_goal: {
              year: 2019,
              month: 13,
              distance_goal: 0.5,
            },
          }
        end

        it "422を返し、エラーメッセージを含む" do
          post "/api/v1/monthly_goals", params: invalid_params, headers: headers

          expect(response).to have_http_status(:unprocessable_content)
          json = response.parsed_body
          expect(json["errors"]).to be_present
        end
      end

      context "重複する年月の場合" do
        before do
          create(:monthly_goal, user: user, year: 2024, month: 6)
        end

        it "422を返し、重複エラーを含む" do
          post "/api/v1/monthly_goals", params: valid_params, headers: headers

          expect(response).to have_http_status(:unprocessable_content)
          json = response.parsed_body
          expect(json["errors"]).to be_present
          expect(json["errors"].join).to include("すでに存在")
        end
      end
    end

    context "未認証ユーザーの場合" do
      it "401を返す" do
        post "/api/v1/monthly_goals", params: valid_params
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PATCH/PUT /api/v1/monthly_goals/:id" do
    let!(:monthly_goal) { create(:monthly_goal, user: user, distance_goal: 100.0) }
    let(:update_params) do
      {
        monthly_goal: {
          distance_goal: 150.0,
        },
      }
    end

    context "認証済みユーザーの場合" do
      context "有効なパラメータの場合" do
        it "月次目標を更新する" do
          patch "/api/v1/monthly_goals/#{monthly_goal.id}",
                params: update_params, headers: headers

          expect(response).to have_http_status(:ok)
          monthly_goal.reload
          expect(monthly_goal.distance_goal).to eq(150.0)
        end
      end

      context "無効なパラメータの場合" do
        let(:invalid_params) do
          {
            monthly_goal: {
              distance_goal: 0,
            },
          }
        end

        it "422を返し、エラーメッセージを含む" do
          patch "/api/v1/monthly_goals/#{monthly_goal.id}",
                params: invalid_params, headers: headers

          expect(response).to have_http_status(:unprocessable_content)
          json = response.parsed_body
          expect(json["errors"]).to be_present
        end
      end
    end

    context "未認証ユーザーの場合" do
      it "401を返す" do
        patch "/api/v1/monthly_goals/#{monthly_goal.id}", params: update_params
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /api/v1/monthly_goals/:id" do
    let!(:monthly_goal) { create(:monthly_goal, user: user) }

    context "認証済みユーザーの場合" do
      it "月次目標を削除する" do
        expect {
          delete "/api/v1/monthly_goals/#{monthly_goal.id}", headers: headers
        }.to change { MonthlyGoal.count }.by(-1)

        expect(response).to have_http_status(:no_content)
      end
    end

    context "未認証ユーザーの場合" do
      it "401を返す" do
        delete "/api/v1/monthly_goals/#{monthly_goal.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
