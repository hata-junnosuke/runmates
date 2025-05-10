class HealthCheckController < ApplicationController
  def index
    render json: { message: "Success Health Check!" }, status: :ok
  end
end
