class CreateRunningRecords < ActiveRecord::Migration[8.0]
  def change
    create_table :running_records do |t|
      t.references :user, null: false, foreign_key: true
      t.date :date, null: false
      t.decimal :distance, precision: 5, scale: 2, null: false

      t.timestamps
    end

    add_index :running_records, [:user_id, :date], unique: true
    add_index :running_records, :date
  end
end
