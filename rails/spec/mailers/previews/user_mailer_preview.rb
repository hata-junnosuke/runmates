# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview
  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/confirmation_email
  def confirmation_email
    user = User.first || FactoryBot.build(:user)
    confirmation_token = "sample_confirmation_token_123"
    UserMailer.confirmation_email(user, confirmation_token)
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/welcome_email
  def welcome_email
    user = User.first || FactoryBot.build(:user)
    UserMailer.welcome_email(user)
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer/password_reset
  def password_reset
    user = User.first || FactoryBot.build(:user)
    reset_password_token = "sample_reset_password_token_456"
    UserMailer.password_reset(user, reset_password_token)
  end
end
