class Api::V1::CurrentMonthlyGoalController < Api::V1::BaseController
  before_action :authenticate_user!

  def show
    current_goal = current_user.monthly_goals.for_current_month.first

    if current_goal
      render json: current_goal
    else
      # 一貫したレスポンス構造のためにデフォルト値を含む完全なオブジェクトを返す
      render json: {
        id: nil,
        year: Date.current.year,
        month: Date.current.month,
        distance_goal: 50.0,
        created_at: nil,
        updated_at: nil,
      }, status: :ok
    end
  end

  def create
    goal_params = monthly_goal_params
    year = goal_params[:year]&.to_i || Date.current.year
    month = goal_params[:month]&.to_i || Date.current.month

    @monthly_goal = current_user.monthly_goals.find_or_initialize_by(year: year, month: month)
    @monthly_goal.distance_goal = goal_params[:distance_goal]

    if @monthly_goal.save
      render json: @monthly_goal, status: @monthly_goal.previously_new_record? ? :created : :ok
    else
      render json: { errors: @monthly_goal.errors }, status: :unprocessable_entity
    end
  end

  private

    def monthly_goal_params
      params.require(:monthly_goal).permit(:year, :month, :distance_goal)
    end
end
