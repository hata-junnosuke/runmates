require "rails_helper"

RSpec.describe "Api::V1::RunningPlans" do
  let(:user) { create(:user) }
  let(:headers) { user.create_new_auth_token }

  describe "GET /api/v1/running_plans" do
    context "認証済みユーザーの場合" do
      before do
        create(:running_plan, user:, date: Date.current.beginning_of_month, planned_distance: 5.0)
        create(:running_plan, user:, date: Date.current.beginning_of_month + 2.days, planned_distance: 7.0)
        create(:running_plan, user:, date: Date.current.prev_month, planned_distance: 6.0)
      end

      it "現在月の予定一覧を返す" do
        get "/api/v1/running_plans", headers: headers

        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json.length).to eq(2)
      end

      it "yearとmonthで指定した月の予定を返す" do
        get "/api/v1/running_plans", params: { year: Date.current.prev_month.year, month: Date.current.prev_month.month }, headers: headers

        expect(response).to have_http_status(:ok)
        json = response.parsed_body
        expect(json.length).to eq(1)
      end
    end

    context "未認証ユーザーの場合" do
      it "401を返す" do
        get "/api/v1/running_plans"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /api/v1/running_plans" do
    let(:valid_params) do
      {
        running_plan: {
          date: Date.current,
          planned_distance: 10.0,
          memo: "ロング走",
        },
      }
    end

    context "認証済みユーザーの場合" do
      it "予定を作成する" do
        expect {
          post "/api/v1/running_plans", params: valid_params, headers: headers
        }.to change { RunningPlan.count }.by(1)

        expect(response).to have_http_status(:created)
        expect(response.parsed_body["planned_distance"]).to eq("10.0")
      end

      it "無効なパラメータの場合422を返す" do
        invalid_params = {
          running_plan: {
            date: nil,
            planned_distance: -1,
          },
        }

        post "/api/v1/running_plans", params: invalid_params, headers: headers

        expect(response).to have_http_status(:unprocessable_content)
        expect(response.parsed_body["errors"]).to be_present
      end
    end

    context "未認証ユーザーの場合" do
      it "401を返す" do
        post "/api/v1/running_plans", params: valid_params
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PATCH /api/v1/running_plans/:id" do
    let!(:plan) { create(:running_plan, user:, planned_distance: 5.0, status: "planned") }

    context "認証済みユーザーの場合" do
      it "予定を更新する" do
        patch "/api/v1/running_plans/#{plan.id}",
              params: { running_plan: { planned_distance: 8.0 } },
              headers: headers

        expect(response).to have_http_status(:ok)
        expect(plan.reload.planned_distance).to eq(8.0)
        expect(plan.reload.status).to eq("planned")
      end

      it "他ユーザーの予定は更新できない" do
        other_user = create(:user)
        other_plan = create(:running_plan, user: other_user)

        patch "/api/v1/running_plans/#{other_plan.id}",
              params: { running_plan: { planned_distance: 9.0 } },
              headers: headers

        expect(response.status).to be_in([404, 401, 403])
      end
    end

    context "未認証ユーザーの場合" do
      it "401を返す" do
        patch "/api/v1/running_plans/#{plan.id}", params: { running_plan: { planned_distance: 8.0 } }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /api/v1/running_plans/:id" do
    let!(:plan) { create(:running_plan, user:) }

    context "認証済みユーザーの場合" do
      it "予定を削除する" do
        expect {
          delete "/api/v1/running_plans/#{plan.id}", headers: headers
        }.to change { RunningPlan.count }.by(-1)

        expect(response).to have_http_status(:no_content)
      end
    end

    context "未認証ユーザーの場合" do
      it "401を返す" do
        delete "/api/v1/running_plans/#{plan.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
