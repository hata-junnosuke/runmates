# == Schema Information
#
# Table name: running_records
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  date       :date             not null
#  distance   :decimal(5, 2)    not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_running_records_on_date              (date)
#  index_running_records_on_user_id           (user_id)
#  index_running_records_on_user_id_and_date  (user_id,date)
#

class RunningRecord < ApplicationRecord
  belongs_to :user

  validates :date, presence: true
  validates :distance, presence: true,
                       numericality: { greater_than: 0.1, less_than_or_equal_to: 100.0 }

  scope :for_year, ->(year) { where("YEAR(date) = ?", year) }
  scope :for_month, ->(year, month) { where("YEAR(date) = ? AND MONTH(date) = ?", year, month) }
  scope :recent, -> { order(date: :desc) }
end
