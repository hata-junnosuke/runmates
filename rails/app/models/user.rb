# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable
  include DeviseTokenAuth::Concerns::User

  has_many :running_records, dependent: :destroy
  has_many :running_plans, dependent: :destroy
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
  def request_email_change(new_email) # rubocop:disable Naming/PredicateMethod
    return false unless valid_email_change?(new_email)

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
  def confirm_email_change(token) # rubocop:disable Naming/PredicateMethod
    return false unless valid_email_confirmation?(token)

    apply_email_change

    if save
      # 変更完了通知を送信
      UserMailerJob.perform_later("email_changed", self, nil)
      true
    else
      false
    end
  end

  private

    def valid_email_change?(new_email)
      if new_email.blank?
        errors.add(:base, "新しいメールアドレスを入力してください")
        return false
      end

      # メールアドレスの形式チェック
      unless new_email.match?(/\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i)
        errors.add(:base, "有効なメールアドレスを入力してください")
        return false
      end

      if email == new_email
        errors.add(:base, "現在のメールアドレスと同じです")
        return false
      end

      # 新しいメールアドレスが既に使用されているかチェック
      if User.exists?(email: new_email)
        errors.add(:base, "このメールアドレスは既に使用されています")
        return false
      end

      true
    end

    def valid_email_confirmation?(token)
      return false if token.blank?

      # トークンを検証
      digest = Devise.token_generator.digest(User, :pending_email_confirmation_token, token)
      return false unless pending_email_confirmation_token == digest

      pending_email.present?
    end

    def apply_email_change
      self.email = pending_email
      self.uid = pending_email # DeviseTokenAuthのためuidも更新
      self.pending_email = nil
      self.pending_email_confirmation_token = nil
      self.pending_email_confirmed_at = Time.current
    end
end
