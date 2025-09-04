class AddEmailChangeFieldsToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :pending_email, :string
    add_column :users, :pending_email_confirmation_token, :string
    add_column :users, :pending_email_confirmed_at, :datetime

    add_index :users, :pending_email_confirmation_token, unique: true, name: 'idx_users_pending_email_token'
  end
end
