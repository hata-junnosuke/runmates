class ApplicationController < ActionController::API
  def ping
    render json: { message: "pong" }
  end
end
