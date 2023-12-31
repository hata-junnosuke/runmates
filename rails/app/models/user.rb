# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable
  include DeviseTokenAuth::Concerns::User

  has_many :records, dependent: :destroy
  has_many :group_users, dependent: :destroy
  has_many :groups, through: :group_users

  validates :name, presence: true, length: { maximum: 50 }
  validates :email, presence: true, uniqueness: true
end
