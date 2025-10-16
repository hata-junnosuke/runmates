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
                       numericality: { greater_than: 0 }
  validate :date_must_be_on_or_after_min_date

  scope :for_year, ->(year) { where("YEAR(date) = ?", year) }
  scope :for_month, ->(year, month) { where("YEAR(date) = ? AND MONTH(date) = ?", year, month) }
  scope :recent, -> { order(date: :desc) }

  MIN_DATE = Date.new(2025, 1, 1)
  private_constant :MIN_DATE

  private

    def date_must_be_on_or_after_min_date
      return if date.blank?

      if date < MIN_DATE
        errors.add(:date, "は2025年1月1日以降の日付を入力してください")
      end

      raw_date = read_attribute_before_type_cast("date")
      return unless raw_date.is_a?(String) && raw_date.present?

      unless raw_date.match?(/\A\d{4}-\d{2}-\d{2}\z/)
        errors.add(:date, "はYYYY-MM-DD形式で入力してください")
      end
    end
end
