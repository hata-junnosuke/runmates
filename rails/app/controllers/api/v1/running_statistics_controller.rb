class Api::V1::RunningStatisticsController < Api::V1::BaseController
  before_action :authenticate_user!

  # 統計情報を取得(ダッシュボードの「統計カード」と「最近の記録」に使用)
  def show
    current_year = Date.current.year
    current_month = Date.current.month

    stats = {
      this_year_distance: current_user.running_records.for_year(current_year).sum(:distance),
      this_month_distance: current_user.running_records.for_month(current_year, current_month).sum(:distance),
      total_records: current_user.running_records.count,
      recent_records: ActiveModelSerializers::SerializableResource.new(
        current_user.running_records.recent.limit(5),
        each_serializer: RunningRecordSerializer,
      ).as_json,
    }

    render json: stats
  end
end
