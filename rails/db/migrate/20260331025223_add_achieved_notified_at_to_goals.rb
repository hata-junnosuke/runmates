class AddAchievedNotifiedAtToGoals < ActiveRecord::Migration[8.1]
  def change
    add_column :monthly_goals, :achieved_notified_at, :datetime
    add_column :yearly_goals, :achieved_notified_at, :datetime
  end
end
