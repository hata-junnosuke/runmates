class RunningPlanStatusUpdater
  def self.call(user:, date:)
    new(user:, date:).call
  end

  def initialize(user:, date:)
    @user = user
    @date = date
  end

  def call
    plans = target_plans
    return if plans.empty?

    remaining_distance = total_running_distance

    plans.each do |plan|
      plan.status = status_for(plan, remaining_distance)
      # 同日複数の予定がある場合に実績距離を順に充当するため、残距離を更新して次の予定に渡す
      remaining_distance = [remaining_distance - plan.planned_distance, 0].max
      plan.save! if plan.changed?
    end
  end

  private

    attr_reader :user, :date

    def target_plans
      user.running_plans.where(date: date).order(:created_at, :id)
    end

    def total_running_distance
      user.running_records.where(date: date).sum(:distance)
    end

    def status_for(plan, remaining_distance)
      return "planned" if remaining_distance <= 0
      return "completed" if remaining_distance >= plan.planned_distance

      "partial"
    end
end
