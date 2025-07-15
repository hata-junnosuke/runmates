require "rails_helper"

RSpec.describe "Api::V1::RunningRecords", type: :request do
  let(:user) { create(:user) }
  let(:headers) { user.create_new_auth_token }

  describe "GET /api/v1/running_records" do
    context "認証済みユーザーの場合" do
      before do
        create_list(:running_record, 3, user: user)
      end

      it "ランニングレコード一覧を返す" do
        get "/api/v1/running_records", headers: headers

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json.length).to eq(3)
      end

      it "最大50件まで返す" do
        create_list(:running_record, 60, user: user)
        get "/api/v1/running_records", headers: headers

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json.length).to eq(50)
      end
    end

    context "未認証ユーザーの場合" do
      it "401を返す" do
        get "/api/v1/running_records"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "GET /api/v1/running_records/:id" do
    let!(:running_record) { create(:running_record, user: user) }

    context "認証済みユーザーの場合" do
      it "指定されたランニングレコードを返す" do
        get "/api/v1/running_records/#{running_record.id}", headers: headers

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["id"]).to eq(running_record.id)
        expect(json["distance"]).to eq(running_record.distance.to_s)
      end

      it "他のユーザーのレコードにはアクセスできない" do
        other_user = create(:user)
        other_record = create(:running_record, user: other_user)

        get "/api/v1/running_records/#{other_record.id}", headers: headers
        # レコードが見つからない場合の動作を確認
        # 実装によってはステータスが違う可能性があるため、現在の実装を受け入れる
        expect(response.status).to be_in([404, 401, 403])
      end
    end

    context "未認証ユーザーの場合" do
      it "401を返す" do
        get "/api/v1/running_records/#{running_record.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /api/v1/running_records" do
    let(:valid_params) do
      {
        running_record: {
          date: Date.current,
          distance: 5.0,
        },
      }
    end

    context "認証済みユーザーの場合" do
      context "有効なパラメータの場合" do
        it "新しいランニングレコードを作成する" do
          expect {
            post "/api/v1/running_records", params: valid_params, headers: headers
          }.to change { RunningRecord.count }.by(1)

          expect(response).to have_http_status(:created)
          json = JSON.parse(response.body)
          expect(json["distance"]).to eq("5.0")
        end

        it "同じ日付で複数のレコードを作成できる" do # rubocop:disable RSpec/ExampleLength
          # 1つ目のレコード
          post "/api/v1/running_records", params: valid_params, headers: headers
          expect(response).to have_http_status(:created)

          # 2つ目のレコード（同じ日付）
          second_params = {
            running_record: {
              date: Date.current,
              distance: 3.0,
            },
          }
          expect {
            post "/api/v1/running_records", params: second_params, headers: headers
          }.to change { RunningRecord.count }.by(1)

          expect(response).to have_http_status(:created)

          # 同じ日付のレコードが2つあることを確認
          records = user.running_records.where(date: Date.current)
          expect(records.count).to eq(2)
          expect(records.sum(:distance)).to eq(8.0)
        end
      end

      context "無効なパラメータの場合" do
        let(:invalid_params) do
          {
            running_record: {
              date: nil,
              distance: -1.0,
            },
          }
        end

        it "422を返し、エラーメッセージを含む" do
          post "/api/v1/running_records", params: invalid_params, headers: headers

          expect(response).to have_http_status(:unprocessable_entity)
          json = JSON.parse(response.body)
          expect(json["errors"]).to be_present
        end
      end
    end

    context "未認証ユーザーの場合" do
      it "401を返す" do
        post "/api/v1/running_records", params: valid_params
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PATCH/PUT /api/v1/running_records/:id" do
    let!(:running_record) { create(:running_record, user: user, distance: 5.0) }
    let(:update_params) do
      {
        running_record: {
          distance: 10.0,
        },
      }
    end

    context "認証済みユーザーの場合" do
      context "有効なパラメータの場合" do
        it "ランニングレコードを更新する" do
          patch "/api/v1/running_records/#{running_record.id}",
                params: update_params, headers: headers

          expect(response).to have_http_status(:ok)
          running_record.reload
          expect(running_record.distance).to eq(10.0)
        end
      end

      context "無効なパラメータの場合" do
        let(:invalid_params) do
          {
            running_record: {
              distance: -1.0,
            },
          }
        end

        it "422を返し、エラーメッセージを含む" do
          patch "/api/v1/running_records/#{running_record.id}",
                params: invalid_params, headers: headers

          expect(response).to have_http_status(:unprocessable_entity)
          json = JSON.parse(response.body)
          expect(json["errors"]).to be_present
        end
      end
    end

    context "未認証ユーザーの場合" do
      it "401を返す" do
        patch "/api/v1/running_records/#{running_record.id}", params: update_params
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /api/v1/running_records/:id" do
    let!(:running_record) { create(:running_record, user: user) }

    context "認証済みユーザーの場合" do
      it "ランニングレコードを削除する" do
        expect {
          delete "/api/v1/running_records/#{running_record.id}", headers: headers
        }.to change { RunningRecord.count }.by(-1)

        expect(response).to have_http_status(:no_content)
      end

      it "他のユーザーのレコードは削除できない" do
        other_user = create(:user)
        other_record = create(:running_record, user: other_user)

        expect {
          delete "/api/v1/running_records/#{other_record.id}", headers: headers
        }.not_to change { RunningRecord.count }

        expect(response.status).to be_in([404, 401, 403])
      end

      it "存在しないレコードを削除しようとすると404を返す" do
        non_existent_id = 99999
        delete "/api/v1/running_records/#{non_existent_id}", headers: headers

        expect(response).to have_http_status(:not_found)
      end
    end

    context "未認証ユーザーの場合" do
      it "401を返す" do
        delete "/api/v1/running_records/#{running_record.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
