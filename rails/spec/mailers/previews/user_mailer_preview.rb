# Preview all emails at http://localhost:3000/rails/mailers/user_mailer_mailer
class UserMailerPreview < ActionMailer::Preview
  # Preview this email at http://localhost:3000/rails/mailers/user_mailer_mailer/welcome_email
  def welcome_email
    UserMailer.welcome_email
  end

  # Preview this email at http://localhost:3000/rails/mailers/user_mailer_mailer/password_reset
  def password_reset
    UserMailer.password_reset
  end
end
