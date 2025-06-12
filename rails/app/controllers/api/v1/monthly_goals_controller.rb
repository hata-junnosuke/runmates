class Api::V1::MonthlyGoalsController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :set_monthly_goal, only: [:show, :update, :destroy]

  def index
    @monthly_goals = current_user.monthly_goals.order(year: :desc, month: :desc)
    render json: @monthly_goals
  end

  def show
    render json: @monthly_goal
  end

  def create
    @monthly_goal = current_user.monthly_goals.build(monthly_goal_params)

    if @monthly_goal.save
      render json: @monthly_goal, status: :created
    else
      render json: { errors: @monthly_goal.errors }, status: :unprocessable_entity
    end
  end

  def update
    if @monthly_goal.update(monthly_goal_params)
      render json: @monthly_goal
    else
      render json: { errors: @monthly_goal.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @monthly_goal.destroy!
    head :no_content
  end

  private

    def set_monthly_goal
      @monthly_goal = current_user.monthly_goals.find(params[:id])
    end

    def monthly_goal_params
      params.require(:monthly_goal).permit(:year, :month, :distance_goal)
    end
end
