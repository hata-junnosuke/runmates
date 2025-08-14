class Api::V1::CurrentYearlyGoalController < Api::V1::BaseController
  before_action :authenticate_user!

  def show
    current_goal = current_user.yearly_goals.for_current_year.first

    if current_goal
      render json: current_goal
    else
      # 一貫したレスポンス構造のためにデフォルト値を含む完全なオブジェクトを返す
      render json: {
        id: nil,
        year: Date.current.year,
        distance_goal: nil,
        created_at: nil,
        updated_at: nil,
      }, status: :ok
    end
  end

  def create
    goal_params = yearly_goal_params
    year = goal_params[:year]&.to_i || Date.current.year

    @yearly_goal = current_user.yearly_goals.find_or_initialize_by(year: year)
    @yearly_goal.distance_goal = goal_params[:distance_goal]

    if @yearly_goal.save
      render json: @yearly_goal, status: @yearly_goal.previously_new_record? ? :created : :ok
    else
      render json: { errors: @yearly_goal.errors }, status: :unprocessable_entity
    end
  end

  private

    def yearly_goal_params
      params.expect(yearly_goal: [:year, :distance_goal])
    end
end
