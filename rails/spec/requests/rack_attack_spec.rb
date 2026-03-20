# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Rack::Attack", :rack_attack do
  let(:ip) { "1.2.3.4" }

  describe "POST /api/v1/auth/sign_in のレート制限" do
    it "10回までは許可し、11回目で429を返す" do
      10.times do
        post "/api/v1/auth/sign_in",
             params: { email: "test@example.com", password: "password" }.to_json,
             headers: { "CONTENT_TYPE" => "application/json", "REMOTE_ADDR" => ip }
      end

      post "/api/v1/auth/sign_in",
           params: { email: "test@example.com", password: "password" }.to_json,
           headers: { "CONTENT_TYPE" => "application/json", "REMOTE_ADDR" => ip }

      expect(response).to have_http_status(:too_many_requests)
    end
  end

  describe "POST /api/v1/auth/password のレート制限" do
    it "5回までは許可し、6回目で429を返す" do
      5.times do
        post "/api/v1/auth/password",
             params: { email: "test@example.com" }.to_json,
             headers: { "CONTENT_TYPE" => "application/json", "REMOTE_ADDR" => ip }
      end

      post "/api/v1/auth/password",
           params: { email: "test@example.com" }.to_json,
           headers: { "CONTENT_TYPE" => "application/json", "REMOTE_ADDR" => ip }

      expect(response).to have_http_status(:too_many_requests)
    end
  end

  describe "POST /api/v1/auth のレート制限" do
    it "3回までは許可し、4回目で429を返す" do
      3.times do
        post "/api/v1/auth",
             params: { email: "test@example.com", password: "password", password_confirmation: "password" }.to_json,
             headers: { "CONTENT_TYPE" => "application/json", "REMOTE_ADDR" => ip }
      end

      post "/api/v1/auth",
           params: { email: "test@example.com", password: "password", password_confirmation: "password" }.to_json,
           headers: { "CONTENT_TYPE" => "application/json", "REMOTE_ADDR" => ip }

      expect(response).to have_http_status(:too_many_requests)
    end
  end

  describe "429レスポンスの形式" do
    it "JSON形式でエラーメッセージとRetry-Afterヘッダーを返す" do
      11.times do
        post "/api/v1/auth/sign_in",
             params: { email: "test@example.com", password: "password" }.to_json,
             headers: { "CONTENT_TYPE" => "application/json", "REMOTE_ADDR" => ip }
      end

      expect(response.content_type).to include("application/json")
      body = response.parsed_body
      expect(body["error"]).to eq("リクエスト制限に達しました。しばらくしてから再度お試しください。")
      expect(response.headers["Retry-After"]).to be_present
    end
  end

  describe "異なるIPからのリクエスト" do
    it "異なるIPからは制限を受けない" do
      10.times do
        post "/api/v1/auth/sign_in",
             params: { email: "test@example.com", password: "password" }.to_json,
             headers: { "CONTENT_TYPE" => "application/json", "REMOTE_ADDR" => ip }
      end

      post "/api/v1/auth/sign_in",
           params: { email: "test@example.com", password: "password" }.to_json,
           headers: { "CONTENT_TYPE" => "application/json", "REMOTE_ADDR" => "5.6.7.8" }

      expect(response).not_to have_http_status(:too_many_requests)
    end
  end
end
