require "rails_helper"

RSpec.describe "Api::V1::Current::Users", type: :request do
  describe "GET api/v1/current/user" do
    subject { get(api_v1_current_user_path, headers:) }

    let(:current_user) { create(:user) }
    let(:headers) { current_user.create_new_auth_token }

    context "ヘッダー情報が正常に送られた時" do
      it "正常にレコードを取得できる" do
        subject
        res = response.parsed_body
        expect(res.keys).to eq ["id", "name", "email"]
        expect(response).to have_http_status(:ok)
      end
    end

    context "ヘッダー情報が空のままリクエストが送信された時" do
      let(:headers) { nil }

      it "unauthorized エラーが返る" do
        subject
        res = response.parsed_body
        expect(res["errors"]).to eq ["ログインもしくはアカウント登録してください。"]
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE api/v1/current/user" do
    let(:current_user) { create(:user, password: "password123") }
    let(:headers) { current_user.create_new_auth_token }

    context "認証済みの場合" do
      context "正しいパスワードが提供された場合" do
        it "ユーザーアカウントが削除される" do
          # current_userが作成されることを確実にする
          expect(User.exists?(current_user.id)).to be true

          expect {
            delete api_v1_current_user_path,
                   params: { password: "password123" },
                   headers: headers
          }.to change { User.count }.by(-1)

          expect(response).to have_http_status(:ok)
          res = response.parsed_body
          expect(res["message"]).to eq("アカウントが正常に削除されました")
        end

        it "関連データも削除される" do
          # 関連データを作成
          create(:running_record, user: current_user)
          create(:monthly_goal, user: current_user)
          create(:yearly_goal, user: current_user)

          expect {
            delete api_v1_current_user_path,
                   params: { password: "password123" },
                   headers: headers
          }.to change { RunningRecord.count }.by(-1).
                 and change { MonthlyGoal.count }.by(-1).
                       and change { YearlyGoal.count }.by(-1)
        end

        it "削除プロセスがログに記録される" do
          allow(Rails.logger).to receive(:info)

          delete api_v1_current_user_path,
                 params: { password: "password123" },
                 headers: headers

          expect(Rails.logger).to have_received(:info).with(/User deletion initiated/)
          expect(Rails.logger).to have_received(:info).with(/User deletion completed/)
        end
      end

      context "間違ったパスワードが提供された場合" do
        it "エラーが返されユーザーは削除されない" do
          delete api_v1_current_user_path,
                 params: { password: "wrongpassword" },
                 headers: headers

          expect(response).to have_http_status(:unprocessable_entity)
          res = response.parsed_body
          expect(res["errors"]).to include("パスワードが正しくありません")
          expect(User.exists?(current_user.id)).to be true
        end
      end

      context "パスワードが提供されない場合" do
        it "エラーが返される" do
          delete api_v1_current_user_path, headers: headers

          expect(response).to have_http_status(:unprocessable_entity)
          res = response.parsed_body
          expect(res["errors"]).to include("パスワードが必要です")
          expect(User.exists?(current_user.id)).to be true
        end
      end

      context "削除が失敗した場合" do
        it "エラーが返されトランザクションがロールバックされる" do
          # ユーザーが既に存在することを確認
          expect(User.exists?(current_user.id)).to be true

          allow_any_instance_of(User).to receive(:destroy!).and_raise(StandardError, "Deletion failed")
          allow(Rails.logger).to receive(:error)

          expect {
            delete api_v1_current_user_path,
                   params: { password: "password123" },
                   headers: headers
          }.not_to change { User.count }

          expect(response).to have_http_status(:unprocessable_entity)
          res = response.parsed_body
          expect(res["errors"]).to include("アカウントの削除に失敗しました")
          expect(Rails.logger).to have_received(:error).with(/User deletion failed/)
        end
      end
    end

    context "未認証の場合" do
      it "unauthorized エラーが返る" do
        delete api_v1_current_user_path, params: { password: "password123" }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
