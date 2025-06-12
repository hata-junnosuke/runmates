class RunningRecord < ApplicationRecord
  belongs_to :user

  validates :date, presence: true, uniqueness: { scope: :user_id }
  validates :distance, presence: true,
                       numericality: { greater_than: 0.1, less_than_or_equal_to: 100.0 }

  scope :for_year, ->(year) { where("YEAR(date) = ?", year) }
  scope :for_month, ->(year, month) { where("YEAR(date) = ? AND MONTH(date) = ?", year, month) }
  scope :recent, -> { order(date: :desc) }
end
