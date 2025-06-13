class MonthlyGoal < ApplicationRecord
  belongs_to :user

  validates :year, presence: true,
                   numericality: { in: 2020..2050 }
  validates :month, presence: true,
                    numericality: { in: 1..12 }
  validates :distance_goal, presence: true,
                            numericality: { greater_than: 1.0, less_than_or_equal_to: 500.0 }
  validates :user_id, uniqueness: { scope: [:year, :month] }

  scope :for_current_month, -> { where(year: Date.current.year, month: Date.current.month) }
end
