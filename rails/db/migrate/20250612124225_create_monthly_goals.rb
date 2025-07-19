class CreateMonthlyGoals < ActiveRecord::Migration[8.0]
  def change
    create_table :monthly_goals do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :year, null: false
      t.integer :month, null: false
      t.decimal :distance_goal, precision: 5, scale: 2, null: false

      t.timestamps
    end

    add_index :monthly_goals, [:user_id, :year, :month], unique: true
  end
end
