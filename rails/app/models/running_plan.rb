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
  STATUSES = %w[planned partial completed].freeze

  validates :date, presence: true
  validates :planned_distance,
            presence: true,
            numericality: { greater_than: 0, less_than: 1000 }
  validates :status, presence: true, inclusion: { in: STATUSES }

  scope :for_month, ->(year, month) { where("YEAR(date) = ? AND MONTH(date) = ?", year, month) }
end
