class Api::V1::RunningPlansController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :set_running_plan, only: [:update, :destroy, :show]

  def index
    start_date =
      if params[:year].present? && params[:month].present?
        year = params[:year].to_i
        month = params[:month].to_i
        Date.new(year, month, 1)
      else
        Date.current.beginning_of_month
      end
    end_date = start_date.end_of_month

    plans = current_user.running_plans.where(date: start_date..end_date).order(:date, :created_at, :id)
    render json: plans, each_serializer: RunningPlanSerializer
  end

  def show
    render json: @running_plan, serializer: RunningPlanSerializer
  end

  def create
    running_plan = current_user.running_plans.build(running_plan_params)

    if running_plan.save
      RunningPlanStatusUpdater.call(user: current_user, date: running_plan.date)
      render json: running_plan, serializer: RunningPlanSerializer, status: :created
    else
      render json: { errors: running_plan.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    old_date = @running_plan.date

    if @running_plan.update(running_plan_params)
      [old_date, @running_plan.date].compact.uniq.each do |target_date|
        RunningPlanStatusUpdater.call(user: current_user, date: target_date)
      end
      render json: @running_plan, serializer: RunningPlanSerializer
    else
      render json: { errors: @running_plan.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    date = @running_plan.date
    @running_plan.destroy!
    RunningPlanStatusUpdater.call(user: current_user, date:)
    head :no_content
  end

  private

    def set_running_plan
      @running_plan = current_user.running_plans.find(params[:id])
    end

    def running_plan_params
      params.expect(running_plan: [:date, :planned_distance, :memo])
    end
end
