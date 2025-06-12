class YearlyGoal < ApplicationRecord
  belongs_to :user

  validates :year, presence: true,
                   numericality: { in: 2020..2050 }
  validates :distance_goal, presence: true,
                            numericality: { greater_than: 50.0, less_than_or_equal_to: 2000.0 }
  validates :user_id, uniqueness: { scope: :year }

  scope :for_current_year, -> { where(year: Date.current.year) }
end
