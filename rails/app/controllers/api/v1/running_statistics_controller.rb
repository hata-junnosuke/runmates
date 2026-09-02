class Api::V1::RunningStatisticsController < Api::V1::BaseController
  before_action :authenticate_user!

  # 統計情報を取得(ダッシュボードの「統計カード」と「最近の記録」に使用)
  def show
    render json: {
      # フロントエンド(Vercel)はUTCで動くため「今日」を自前で算出するとJSTと1日ズレる。
      # JSTのDate.currentを持つRailsが唯一の判断基準になるので、レスポンスに含めて渡す。
      today: today,
      this_year_distance: current_user.running_records.for_year(today.year).sum(:distance),
      this_month_distance: current_user.running_records.
                             for_month(today.year, today.month).
                             sum(:distance),
      this_month_planned_distance: this_month_planned_distance,
      total_records: current_user.running_records.count,
      recent_records: recent_records,
    }
  end

  private

    # リクエスト内で「今日」の基準を1つに固定する。
    # 複数回 Date.current を呼ぶと、深夜0時をまたいだ瞬間にレスポンス内部で食い違う。
    def today
      @today ||= Date.current
    end

    # 今月かつ今日以降の、まだ消化していない予定距離
    def this_month_planned_distance
      current_user.running_plans.
        status_planned.
        for_month(today.year, today.month).
        where(date: today..).
        sum(:planned_distance)
    end

    def recent_records
      ActiveModelSerializers::SerializableResource.new(
        current_user.running_records.recent.limit(5),
        each_serializer: RunningRecordSerializer,
      ).as_json
    end
end
