# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable
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

  # メールアドレス変更リクエスト
  def request_email_change(new_email)
    return false if new_email.blank?
    return false if email == new_email

    # 新しいメールアドレスが既に使用されているかチェック
    if User.exists?(email: new_email)
      errors.add(:pending_email, "は既に使用されています")
      return false
    end

    # トークンを生成して保存
    token = SecureRandom.urlsafe_base64(32)
    self.pending_email = new_email
    self.pending_email_confirmation_token = Devise.token_generator.digest(User, :pending_email_confirmation_token, token)
    self.pending_email_confirmed_at = nil
    
    if save
      # 確認メールを送信
      UserMailerJob.perform_later("email_change", self, token)
      true
    else
      false
    end
  end

  # メールアドレス変更の確認
  def confirm_email_change(token)
    return false if token.blank?
    
    # トークンを検証
    digest = Devise.token_generator.digest(User, :pending_email_confirmation_token, token)
    return false unless pending_email_confirmation_token == digest
    
    # トークンの有効期限確認（24時間）
    if pending_email.present?
      self.email = pending_email
      self.pending_email = nil
      self.pending_email_confirmation_token = nil
      self.pending_email_confirmed_at = Time.current
      
      if save
        # 変更完了通知を送信
        UserMailerJob.perform_later("email_changed", self, nil)
        true
      else
        false
      end
    else
      false
    end
  end
end
