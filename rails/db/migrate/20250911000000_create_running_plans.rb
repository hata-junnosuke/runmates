class CreateRunningPlans < ActiveRecord::Migration[8.0]
  def change
    create_table :running_plans do |t|
      t.references :user, null: false, foreign_key: true
      t.date :date, null: false
      t.decimal :planned_distance, precision: 5, scale: 2, null: false
      t.text :memo
      t.string :status, null: false, default: "planned"

      t.timestamps
    end

    add_index :running_plans, [:user_id, :date]
    add_index :running_plans, :status
  end
end
