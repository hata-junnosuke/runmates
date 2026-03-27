# == Schema Information
#
# Table name: running_plans
#
#  id               :integer          not null, primary key
#  user_id          :integer          not null
#  date             :date             not null
#  planned_distance :decimal(5, 2)    not null
#  memo             :text
#  status           :string           default("planned"), not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#
# Indexes
#
#  index_running_plans_on_status          (status)
#  index_running_plans_on_user_id         (user_id)
#  index_running_plans_on_user_id_and_date  (user_id,date)
#

class RunningPlan < ApplicationRecord
  include DateOnOrAfterMinDate
  belongs_to :user

  validates :date, presence: true
  validates :planned_distance,
            presence: true,
            numericality: { greater_than: 0, less_than: 1000 }
  validates :status, presence: true
  enum :status,
       { planned: "planned", partial: "partial", completed: "completed" },
       prefix: true,
       validate: true

  scope :for_month, ->(year, month) { where("YEAR(date) = ? AND MONTH(date) = ?", year, month) }

  def self.update_statuses(user:, date:)
    plans = user.running_plans.where(date: date).order(:created_at, :id)
    return if plans.empty?

    remaining_distance = user.running_records.where(date: date).sum(:distance)

    plans.each do |plan|
      plan.status = status_for_distance(plan, remaining_distance)
      # 同日複数の予定がある場合に実績距離を順に充当するため、残距離を更新して次の予定に渡す
      remaining_distance = [remaining_distance - plan.planned_distance, 0].max
      plan.save! if plan.changed?
    end
  end

  def self.status_for_distance(plan, remaining_distance)
    return "planned" if remaining_distance <= 0
    return "completed" if remaining_distance >= plan.planned_distance

    "partial"
  end
  private_class_method :status_for_distance
end
