# == Schema Information
#
# Table name: monthly_goals
#
#  id            :integer          not null, primary key
#  user_id       :integer          not null
#  year          :integer          not null
#  month         :integer          not null
#  distance_goal :decimal(5, 2)
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_monthly_goals_on_user_id                     (user_id)
#  index_monthly_goals_on_user_id_and_year_and_month  (user_id,year,month) UNIQUE
#

class MonthlyGoal < ApplicationRecord
  belongs_to :user

  validates :year, presence: true,
                   numericality: { greater_than_or_equal_to: 2020, less_than_or_equal_to: 2050 }
  validates :month, presence: true,
                    inclusion: { in: 1..12 }
  validates :distance_goal, numericality: { greater_than: 0 },
                            allow_nil: true
  validates :user_id, uniqueness: { scope: [:year, :month] }

  scope :for_current_month, -> { where(year: Date.current.year, month: Date.current.month) }
end
