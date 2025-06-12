class Api::V1::RunningRecordsController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :set_running_record, only: [:show, :update, :destroy]

  def index
    @running_records = current_user.running_records.recent.limit(50)
    render json: @running_records
  end

  def show
    render json: @running_record
  end

  def create
    @running_record = current_user.running_records.build(running_record_params)

    if @running_record.save
      render json: @running_record, status: :created
    else
      render json: { errors: @running_record.errors }, status: :unprocessable_entity
    end
  end

  def update
    if @running_record.update(running_record_params)
      render json: @running_record
    else
      render json: { errors: @running_record.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @running_record.destroy!
    head :no_content
  end

  def statistics
    current_year = Date.current.year
    current_month = Date.current.month

    stats = {
      this_year_distance: current_user.running_records.for_year(current_year).sum(:distance),
      this_month_distance: current_user.running_records.for_month(current_year, current_month).sum(:distance),
      total_records: current_user.running_records.count,
      recent_records: current_user.running_records.recent.limit(5),
    }

    render json: stats
  end

  private

    def set_running_record
      @running_record = current_user.running_records.find(params[:id])
    end

    def running_record_params
      params.require(:running_record).permit(:date, :distance)
    end
end
