require "rails_helper"

RSpec.describe "HealthCheck", type: :request do
  describe "GET /api/v1/health_check" do
    subject { get(api_v1_health_check_path) }

    it "正常にレスポンスが返る" do
      subject
      res = response.parsed_body
      expect(res["message"]).to eq "Success Health Check!"
      expect(response).to have_http_status(:success)
    end
  end
end
