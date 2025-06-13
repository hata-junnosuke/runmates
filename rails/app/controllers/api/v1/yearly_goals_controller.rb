class Api::V1::YearlyGoalsController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :set_yearly_goal, only: [:show, :update, :destroy]

  def index
    @yearly_goals = current_user.yearly_goals.order(year: :desc)
    render json: @yearly_goals
  end

  def show
    render json: @yearly_goal
  end

  def create
    @yearly_goal = current_user.yearly_goals.build(yearly_goal_params)

    if @yearly_goal.save
      render json: @yearly_goal, status: :created
    else
      render json: { errors: @yearly_goal.errors }, status: :unprocessable_entity
    end
  end

  def update
    if @yearly_goal.update(yearly_goal_params)
      render json: @yearly_goal
    else
      render json: { errors: @yearly_goal.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @yearly_goal.destroy!
    head :no_content
  end

  private

    def set_yearly_goal
      @yearly_goal = current_user.yearly_goals.find(params[:id])
    end

    def yearly_goal_params
      params.require(:yearly_goal).permit(:year, :distance_goal)
    end
end
