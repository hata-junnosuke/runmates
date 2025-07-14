class RemoveUniqueIndexFromRunningRecords < ActiveRecord::Migration[8.0]
  def change
    remove_index :running_records, [:user_id, :date]
    add_index :running_records, [:user_id, :date]
  end
end
