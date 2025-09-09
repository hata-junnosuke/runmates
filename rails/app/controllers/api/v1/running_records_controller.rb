class Api::V1::RunningRecordsController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :set_running_record, only: [:show, :update, :destroy]

  def index
    # 対象月の日付範囲を決定
    if params[:year].present? && params[:month].present?
      # 特定月のデータを取得
      year = params[:year].to_i
      month = params[:month].to_i
      start_date = Date.new(year, month, 1)
    else
      # デフォルト: 現在月のデータを取得
      start_date = Date.current.beginning_of_month
    end
    end_date = start_date.end_of_month

    @running_records = current_user.running_records.
                         where(date: start_date..end_date).
                         order(date: :desc)

    render json: @running_records, each_serializer: RunningRecordSerializer
  end

  def show
    render json: @running_record, serializer: RunningRecordSerializer
  end

  def create
    @running_record = current_user.running_records.build(running_record_params)

    if @running_record.save
      render json: @running_record, serializer: RunningRecordSerializer, status: :created
    else
      render json: { errors: @running_record.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @running_record.update(running_record_params)
      render json: @running_record, serializer: RunningRecordSerializer
    else
      render json: { errors: @running_record.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @running_record.destroy!
    head :no_content
  end

  private

    def set_running_record
      @running_record = current_user.running_records.find(params[:id])
    end

    def running_record_params
      params.expect(running_record: [:date, :distance])
    end
end
