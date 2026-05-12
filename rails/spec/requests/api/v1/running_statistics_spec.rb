require "rails_helper"

RSpec.describe "Api::V1::RunningStatistics" do
  include ActiveSupport::Testing::TimeHelpers

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
        get "/api/v1/running_statistics", headers: headers, as: :json

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
          get "/api/v1/running_statistics", headers: headers, as: :json

          expect(response).to have_http_status(:ok)

          json_response = response.parsed_body

          expect(json_response["this_year_distance"]).to eq("0.0")
          expect(json_response["this_month_distance"]).to eq("0.0")
          expect(json_response["total_records"]).to eq(0)
          expect(json_response["recent_records"]).to eq([])
        end
      end
    end

    context "this_month_planned_distance" do
      # 月初・月末や境界の影響を避けるため、月の中旬に固定する
      let(:fixed_today) { Date.new(2026, 5, 15) }
      let(:other_user) { create(:user) }

      before { travel_to(fixed_today) }

      context "今月かつ今日以降の planned 予定がある場合" do
        before do
          # 今日以降の今月の planned 予定（加算される）
          create(:running_plan, user: user, date: fixed_today, planned_distance: 5.0, status: "planned")
          create(:running_plan, user: user, date: fixed_today + 1.day, planned_distance: 3.0, status: "planned")
        end

        it "今月かつ今日以降の planned 予定の planned_distance 合計を返すこと" do
          get "/api/v1/running_statistics", headers: headers, as: :json

          expect(response).to have_http_status(:ok)
          expect(response.parsed_body["this_month_planned_distance"]).to eq("8.0")
        end
      end

      context "ステータスが partial / completed の場合" do
        before do
          create(:running_plan, user: user, date: fixed_today, planned_distance: 10.0, status: "partial")
          create(:running_plan, user: user, date: fixed_today, planned_distance: 7.0, status: "completed")
        end

        it "partial / completed の予定は加算されないこと" do
          get "/api/v1/running_statistics", headers: headers, as: :json

          expect(response).to have_http_status(:ok)
          expect(response.parsed_body["this_month_planned_distance"]).to eq("0.0")
        end
      end

      context "先月・翌月の planned 予定がある場合" do
        before do
          create(:running_plan, user: user, date: fixed_today.prev_month, planned_distance: 6.0, status: "planned")
          create(:running_plan, user: user, date: fixed_today.next_month.beginning_of_month,
                                planned_distance: 4.0, status: "planned")
        end

        it "今月外の予定は加算されないこと" do
          get "/api/v1/running_statistics", headers: headers, as: :json

          expect(response).to have_http_status(:ok)
          expect(response.parsed_body["this_month_planned_distance"]).to eq("0.0")
        end
      end

      context "今月の planned 予定でも日付が過去の場合" do
        before do
          create(:running_plan, user: user, date: fixed_today - 1.day, planned_distance: 6.0, status: "planned")
        end

        it "過去日付の planned は加算されないこと" do
          get "/api/v1/running_statistics", headers: headers, as: :json

          expect(response).to have_http_status(:ok)
          expect(response.parsed_body["this_month_planned_distance"]).to eq("0.0")
        end
      end

      context "今月の planned 予定で日付が今日の場合" do
        before do
          create(:running_plan, user: user, date: fixed_today, planned_distance: 4.5, status: "planned")
        end

        it "今日の planned は加算されること" do
          get "/api/v1/running_statistics", headers: headers, as: :json

          expect(response).to have_http_status(:ok)
          expect(response.parsed_body["this_month_planned_distance"]).to eq("4.5")
        end
      end

      context "今月の planned 予定で日付が未来（同月内）の場合" do
        before do
          create(:running_plan, user: user, date: fixed_today + 5.days, planned_distance: 7.5, status: "planned")
        end

        it "未来日付の planned は加算されること" do
          get "/api/v1/running_statistics", headers: headers, as: :json

          expect(response).to have_http_status(:ok)
          expect(response.parsed_body["this_month_planned_distance"]).to eq("7.5")
        end
      end

      context "他ユーザーの planned 予定がある場合" do
        before do
          create(:running_plan, user: other_user, date: fixed_today, planned_distance: 9.9, status: "planned")
        end

        it "他ユーザーの予定は加算されないこと" do
          get "/api/v1/running_statistics", headers: headers, as: :json

          expect(response).to have_http_status(:ok)
          expect(response.parsed_body["this_month_planned_distance"]).to eq("0.0")
        end
      end

      context "対象となる予定が0件の場合" do
        it "0.0 を返すこと" do
          get "/api/v1/running_statistics", headers: headers, as: :json

          expect(response).to have_http_status(:ok)
          expect(response.parsed_body).to have_key("this_month_planned_distance")
          expect(response.parsed_body["this_month_planned_distance"]).to eq("0.0")
        end
      end

      context "既存統計値との非破壊" do
        before do
          # 今月の実績
          create(:running_record, user: user, date: fixed_today, distance: 5.0)
          # 今月の planned（今日以降）
          create(:running_plan, user: user, date: fixed_today + 2.days, planned_distance: 3.0, status: "planned")
        end

        it "既存の this_year_distance / this_month_distance / total_records / recent_records は変化しないこと" do
          get "/api/v1/running_statistics", headers: headers, as: :json

          json_response = response.parsed_body
          expect(json_response["this_year_distance"]).to eq("5.0")
          expect(json_response["this_month_distance"]).to eq("5.0")
          expect(json_response["total_records"]).to eq(1)
          expect(json_response["recent_records"]).to be_an(Array)
          expect(json_response["recent_records"].size).to eq(1)
          expect(json_response["this_month_planned_distance"]).to eq("3.0")
        end
      end
    end

    context "未認証ユーザーの場合" do
      it "401エラーを返すこと" do
        get "/api/v1/running_statistics", as: :json

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
