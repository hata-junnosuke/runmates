class CreateYearlyGoals < ActiveRecord::Migration[8.0]
  def change
    create_table :yearly_goals do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :year
      t.decimal :distance_goal

      t.timestamps
    end
  end
end
