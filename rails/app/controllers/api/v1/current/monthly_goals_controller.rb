class Api::V1::Current::MonthlyGoalsController < Api::V1::BaseController
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
        distance_goal: nil,
        achieved_notified_at: nil,
        created_at: nil,
        updated_at: nil,
      }, status: :ok
    end
  end

  def create
    goal_params = monthly_goal_params
    @monthly_goal = MonthlyGoal.find_or_initialize_for(current_user, goal_params)

    if @monthly_goal.save
      render json: @monthly_goal, status: @monthly_goal.previously_new_record? ? :created : :ok
    else
      render json: { errors: @monthly_goal.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

    def monthly_goal_params
      params.expect(monthly_goal: [:year, :month, :distance_goal, :dismiss_notification])
    end
end
