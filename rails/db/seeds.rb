# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# 検証用テストアカウント（開発環境のみ）
if Rails.env.development?
  User.find_or_create_by!(email: "test@example.com") do |user|
    user.name = "テストユーザー"
    user.password = "password123"
    user.password_confirmation = "password123"
    user.confirmed_at = Time.current
  end
end
