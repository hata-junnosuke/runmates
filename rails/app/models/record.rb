class Record < ApplicationRecord
  belongs_to :user

  validates :distance, presence: true, numericality: { greater_than: 0 }
  validates :date, presence: true
  validates :comment, length: { maximum: 1000 }

  
end
