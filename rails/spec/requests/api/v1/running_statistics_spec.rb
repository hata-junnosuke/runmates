require "rails_helper"

RSpec.describe "Api::V1::RunningStatistics", type: :request do
  let(:user) { create(:user) }
  let(:headers) { user.create_new_auth_token }

  describe "GET /api/v1/running_statistics" do
    let(:current_date) { Date.current }

    context "認証済みユーザーの場合" do
      before do
        # 今月のレコードを作成（月をまたがないように月の中間日付を使用）
        middle_of_month = current_date.beginning_of_month + 14.days
        create(:running_record, user: user, date: middle_of_month, distance: 5.0)
        create(:running_record, user: user, date: middle_of_month - 1.day, distance: 3.0)
        create(:running_record, user: user, date: middle_of_month - 2.days, distance: 4.0)
        create(:running_record, user: user, date: current_date.beginning_of_month, distance: 2.0)

        # 翌年のレコード（長距離）
        create(:running_record, :with_long_distance, user: user, date: current_date.next_year) # 20.0km

        # 他のユーザーのレコード（含まれないはず）
        other_user = create(:user)
        create(:running_record, :with_extreme_distance, user: other_user, date: current_date) # 100.0km
      end

      it "統計情報を返すこと" do
        get "/api/v1/running_statistics", headers: headers

        expect(response).to have_http_status(:ok)

        json_response = response.parsed_body

        # 今年の距離: 5.0 + 3.0 + 4.0 + 2.0 = 14.0
        expect(json_response["this_year_distance"]).to eq("14.0")

        # 今月の距離: 5.0 + 3.0 + 4.0 + 2.0 = 14.0
        expect(json_response["this_month_distance"]).to eq("14.0")

        # 総レコード数: 5（今年4件 + 翌年1件）
        expect(json_response["total_records"]).to eq(5)

        # 最近のレコード（最大5件、日付の降順）
        expect(json_response["recent_records"]).to be_an(Array)
        expect(json_response["recent_records"].size).to eq(5)
        expect(json_response["recent_records"].first["distance"]).to eq("20.0")
      end

      context "レコードがない場合" do
        before do
          user.running_records.destroy_all
        end

        it "0の統計情報を返すこと" do
          get "/api/v1/running_statistics", headers: headers

          expect(response).to have_http_status(:ok)

          json_response = response.parsed_body

          expect(json_response["this_year_distance"]).to eq("0.0")
          expect(json_response["this_month_distance"]).to eq("0.0")
          expect(json_response["total_records"]).to eq(0)
          expect(json_response["recent_records"]).to eq([])
        end
      end
    end

    context "未認証ユーザーの場合" do
      it "401エラーを返すこと" do
        get "/api/v1/running_statistics"

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
