require "rails_helper"

RSpec.describe "Api::V1::Auth::Registrations", type: :request do
  describe "POST /api/v1/auth" do
    let(:valid_params) do
      {
        email: "newuser@example.com",
        password: "password123",
        password_confirmation: "password123",
        name: "新規ユーザー",
      }
    end

    context "有効なパラメータの場合" do
      it "新しいユーザーを作成すること" do
        expect do
          post "/api/v1/auth", params: valid_params
        end.to change { User.count }.by(1)
      end

      it "確認メールを送信すること" do
        expect do
          post "/api/v1/auth", params: valid_params
        end.to have_enqueued_job(ActionMailer::MailDeliveryJob).
                 with("UserMailer", "confirmation_email", "deliver_now", hash_including(args: [instance_of(User), instance_of(String)]))
      end

      it "認証ヘッダーが設定されないこと" do
        post "/api/v1/auth", params: valid_params
        # 確認が完了していないため、認証トークンは設定されない
        expect(response.headers["access-token"]).to be_nil
        expect(response.headers["client"]).to be_nil
        expect(response.headers["uid"]).to be_nil
      end

      it "成功レスポンスを返すこと" do
        post "/api/v1/auth", params: valid_params
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["status"]).to eq("success")
        expect(json["data"]["email"]).to eq(valid_params[:email])
      end
    end

    context "無効なパラメータの場合" do
      let(:invalid_params) { valid_params.merge(password_confirmation: "wrong") }

      it "ユーザーを作成しないこと" do
        expect do
          post "/api/v1/auth", params: invalid_params
        end.not_to change { User.count }
      end

      it "メールを送信しないこと" do
        expect do
          post "/api/v1/auth", params: invalid_params
        end.not_to have_enqueued_job(ActionMailer::MailDeliveryJob)
      end

      it "エラーレスポンスを返すこと" do
        post "/api/v1/auth", params: invalid_params
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json["status"]).to eq("error")
      end
    end
  end
end
