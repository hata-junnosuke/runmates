# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  #  , :confirmable
  include DeviseTokenAuth::Concerns::User

  has_many :running_records, dependent: :destroy
  has_many :monthly_goals, dependent: :destroy
  has_many :yearly_goals, dependent: :destroy

  # DeviseのパスワードリセットメールをオーバーライドしてカスタムMailerを使用
  def send_reset_password_instructions(opts = {})
    token = set_reset_password_token
    UserMailerJob.perform_later("password_reset", self, token)
    token
  end

  # Deviseの確認メールをオーバーライドしてカスタムMailerを使用
  def send_confirmation_instructions
    generate_confirmation_token! unless @raw_confirmation_token
    UserMailerJob.perform_later("confirmation_email", self, @raw_confirmation_token)
  end
end
