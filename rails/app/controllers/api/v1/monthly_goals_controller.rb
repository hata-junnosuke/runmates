class Api::V1::MonthlyGoalsController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    @monthly_goals = current_user.monthly_goals.order(year: :desc, month: :desc)
    render json: @monthly_goals
  end
end
