require "rails_helper"

RSpec.describe "Api::V1::YearlyGoals", type: :request do
  let(:user) { create(:user) }
  let(:headers) { user.create_new_auth_token }

  describe "GET /api/v1/yearly_goals" do
    context "認証済みユーザーの場合" do
      before do
        create(:yearly_goal, user: user, year: 2024)
        create(:yearly_goal, user: user, year: 2023)
        create(:yearly_goal, user: user, year: 2022)
      end

      it "年次目標一覧を年の降順で返す" do
        get "/api/v1/yearly_goals", headers: headers
        
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json.length).to eq(3)
        expect(json[0]["year"]).to eq(2024)
        expect(json[1]["year"]).to eq(2023)
        expect(json[2]["year"]).to eq(2022)
      end
    end

    context "未認証ユーザーの場合" do
      it "401を返す" do
        get "/api/v1/yearly_goals"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "GET /api/v1/yearly_goals/:id" do
    let!(:yearly_goal) { create(:yearly_goal, user: user) }

    context "認証済みユーザーの場合" do
      it "指定された年次目標を返す" do
        get "/api/v1/yearly_goals/#{yearly_goal.id}", headers: headers
        
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["id"]).to eq(yearly_goal.id)
        expect(json["distance_goal"]).to eq(yearly_goal.distance_goal.to_s)
      end

      it "他のユーザーの目標にはアクセスできない" do
        other_user = create(:user)
        other_goal = create(:yearly_goal, user: other_user)
        
        get "/api/v1/yearly_goals/#{other_goal.id}", headers: headers
        expect([404, 401, 403]).to include(response.status)
      end
    end

    context "未認証ユーザーの場合" do
      it "401を返す" do
        get "/api/v1/yearly_goals/#{yearly_goal.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /api/v1/yearly_goals" do
    let(:valid_params) do
      {
        yearly_goal: {
          year: 2024,
          distance_goal: 1200.0
        }
      }
    end

    context "認証済みユーザーの場合" do
      context "有効なパラメータの場合" do
        it "新しい年次目標を作成する" do
          expect {
            post "/api/v1/yearly_goals", params: valid_params, headers: headers
          }.to change(YearlyGoal, :count).by(1)
          
          expect(response).to have_http_status(:created)
          json = JSON.parse(response.body)
          expect(json["distance_goal"]).to eq("1200.0")
        end
      end

      context "無効なパラメータの場合" do
        let(:invalid_params) do
          {
            yearly_goal: {
              year: 2019,
              distance_goal: 30.0
            }
          }
        end

        it "422を返し、エラーメッセージを含む" do
          post "/api/v1/yearly_goals", params: invalid_params, headers: headers
          
          expect(response).to have_http_status(:unprocessable_entity)
          json = JSON.parse(response.body)
          expect(json["errors"]).to be_present
        end
      end

      context "重複する年の場合" do
        before do
          create(:yearly_goal, user: user, year: 2024)
        end

        it "422を返し、重複エラーを含む" do
          post "/api/v1/yearly_goals", params: valid_params, headers: headers
          
          expect(response).to have_http_status(:unprocessable_entity)
          json = JSON.parse(response.body)
          expect(json["errors"]["user_id"]).to be_present
        end
      end
    end

    context "未認証ユーザーの場合" do
      it "401を返す" do
        post "/api/v1/yearly_goals", params: valid_params
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PATCH/PUT /api/v1/yearly_goals/:id" do
    let!(:yearly_goal) { create(:yearly_goal, user: user, distance_goal: 1200.0) }
    let(:update_params) do
      {
        yearly_goal: {
          distance_goal: 1500.0
        }
      }
    end

    context "認証済みユーザーの場合" do
      context "有効なパラメータの場合" do
        it "年次目標を更新する" do
          patch "/api/v1/yearly_goals/#{yearly_goal.id}", 
                params: update_params, headers: headers
          
          expect(response).to have_http_status(:ok)
          yearly_goal.reload
          expect(yearly_goal.distance_goal).to eq(1500.0)
        end
      end

      context "無効なパラメータの場合" do
        let(:invalid_params) do
          {
            yearly_goal: {
              distance_goal: 30.0
            }
          }
        end

        it "422を返し、エラーメッセージを含む" do
          patch "/api/v1/yearly_goals/#{yearly_goal.id}", 
                params: invalid_params, headers: headers
          
          expect(response).to have_http_status(:unprocessable_entity)
          json = JSON.parse(response.body)
          expect(json["errors"]).to be_present
        end
      end
    end

    context "未認証ユーザーの場合" do
      it "401を返す" do
        patch "/api/v1/yearly_goals/#{yearly_goal.id}", params: update_params
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /api/v1/yearly_goals/:id" do
    let!(:yearly_goal) { create(:yearly_goal, user: user) }

    context "認証済みユーザーの場合" do
      it "年次目標を削除する" do
        expect {
          delete "/api/v1/yearly_goals/#{yearly_goal.id}", headers: headers
        }.to change(YearlyGoal, :count).by(-1)
        
        expect(response).to have_http_status(:no_content)
      end
    end

    context "未認証ユーザーの場合" do
      it "401を返す" do
        delete "/api/v1/yearly_goals/#{yearly_goal.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end