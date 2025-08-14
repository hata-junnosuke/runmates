class AllowNullInGoals < ActiveRecord::Migration[8.0]
  def change
    # monthly_goalsテーブルのdistance_goalカラムをnull許可に変更
    change_column_null :monthly_goals, :distance_goal, true

    # yearly_goalsテーブルのdistance_goalカラムをnull許可に変更
    change_column_null :yearly_goals, :distance_goal, true
  end
end
