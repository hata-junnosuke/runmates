class Api::V1::RunningStatisticsController < Api::V1::BaseController
  before_action :authenticate_user!

  def show
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
end
