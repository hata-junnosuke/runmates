require "rails_helper"

RSpec.describe "HealthCheck", type: :request do
  describe "GET /health_check" do
    subject { get(health_check_path) }

    it "正常にレスポンスが返る" do
      subject
      res = JSON.parse(response.body)
      expect(res["message"]).to eq "Success Health Check!"
      expect(response).to have_http_status(:success)
    end
  end
end
