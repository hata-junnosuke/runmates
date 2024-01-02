class CreateRecords < ActiveRecord::Migration[7.1]
  def change
    create_table :records do |t|
      t.integer :distance, null: false
      t.date :date, null: false
      t.text :comment
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
