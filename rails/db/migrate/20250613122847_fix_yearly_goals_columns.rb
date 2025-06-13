class FixYearlyGoalsColumns < ActiveRecord::Migration[8.0]
  def change
    # Add null constraints and precision/scale to existing columns
    change_column_null :yearly_goals, :year, false
    change_column :yearly_goals, :distance_goal, :decimal, precision: 6, scale: 2, null: false
    
    # Add unique index
    add_index :yearly_goals, [:user_id, :year], unique: true
  end
end
