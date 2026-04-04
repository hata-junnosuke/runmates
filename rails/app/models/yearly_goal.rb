# == Schema Information
#
# Table name: yearly_goals
#
#  id                   :integer          not null, primary key
#  user_id              :integer          not null
#  year                 :integer          not null
#  distance_goal        :decimal(6, 2)
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  achieved_notified_at :datetime
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

  before_update :reset_achieved_notified_at, if: :distance_goal_changed?

  def self.find_or_initialize_for(user, params)
    year = params[:year]&.to_i || Date.current.year
    goal = user.yearly_goals.find_or_initialize_by(year: year)
    goal.distance_goal = params[:distance_goal] if params.has_key?(:distance_goal)
    goal.achieved_notified_at = Time.current if params[:dismiss_notification] == true
    goal
  end

  private

    def reset_achieved_notified_at
      self.achieved_notified_at = nil
    end
end
