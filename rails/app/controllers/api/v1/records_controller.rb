class Api::V1::RecordsController < Api::V1::BaseController
  def index
    @records = Record.all.includes(:user)
    @current_user_records = @records.where(user_id: current_user.id)
    @date_records = @current_user_records.group(:date).sum(:distance).map {|date, distance| { date:, distance: } }
    @currrent_user_distance = @current_user_records.sum(:distance)
    render json: { records: @records, current_user_records: @current_user_records, date_records: @date_records, current_user_distance: @currrent_user_distance }
  end

  def show
    @record = Record.find(params[:id])
    render json: @record
  end

  def create
    @record = current_user.records.build(record_params)
    if @record.save
      render json: @record, status: :created
    else
      render json: @record.errors, status: :unprocessable_entity
    end
  end

  def update
    @record = current_user.records.find(params[:id])
    if @record.update(record_params)
      render json: @record
    else
      render json: @record.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @record = current_user.records.find(params[:id])
    @record.destroy!
    render json: {}, status: :no_content
  end

  private

    def record_params
      params.require(:record).permit(:distance, :date, :comment)
    end
end
