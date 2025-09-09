# == Schema Information
#
# Table name: yearly_goals
#
#  id            :integer          not null, primary key
#  user_id       :integer          not null
#  year          :integer          not null
#  distance_goal :decimal(6, 2)
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_yearly_goals_on_user_id           (user_id)
#  index_yearly_goals_on_user_id_and_year  (user_id,year) UNIQUE
#

class YearlyGoal < ApplicationRecord
  belongs_to :user

  validates :year, presence: true,
                   numericality: { greater_than_or_equal_to: 2020, less_than_or_equal_to: 2050 }
  validates :distance_goal, numericality: { greater_than_or_equal_to: 1 },
                            allow_nil: true
  validates :user_id, uniqueness: { scope: :year }

  scope :for_current_year, -> { where(year: Date.current.year) }
end
