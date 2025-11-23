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
  include DateOnOrAfterMinDate
  belongs_to :user

  validates :date, presence: true
  validates :distance, presence: true,
                       numericality: { greater_than: 0 }

  scope :for_year, ->(year) { where("YEAR(date) = ?", year) }
  scope :for_month, ->(year, month) { where("YEAR(date) = ? AND MONTH(date) = ?", year, month) }
  scope :recent, -> { order(date: :desc) }

  after_commit :update_running_plan_statuses

  private

    def update_running_plan_statuses
      return unless user

      # after_commitではselfを省略しても最新値を参照できる。
      # 日付変更や削除にも対応するため、影響する日付を配列にまとめて順に更新する。
      affected_dates = [date]
      if saved_change_to_date?
        old_date, new_date = saved_change_to_date
        affected_dates << old_date if old_date
        affected_dates << new_date if new_date
      end

      affected_dates.compact.uniq.each do |target_date|
        RunningPlanStatusUpdater.call(user:, date: target_date)
      end
    end
end
