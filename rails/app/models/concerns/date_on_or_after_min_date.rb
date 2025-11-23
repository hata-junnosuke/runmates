module DateOnOrAfterMinDate
  extend ActiveSupport::Concern
  DEFAULT_MIN_DATE = Date.new(2025, 1, 1)

  included do
    validate :date_on_or_after_min_date
  end

  private

    def min_date
      # クラス側でMIN_DATEをオーバーライドしていればそれを使い、なければデフォルト
      if self.class.const_defined?(:MIN_DATE, false)
        self.class::MIN_DATE
      else
        DEFAULT_MIN_DATE
      end
    end

    def date_on_or_after_min_date
      return if date.blank?

      threshold = min_date
      if date < threshold
        errors.add(:date, "は#{threshold.strftime("%Y年%-m月%-d日")}以降の日付を入力してください")
      end

      raw_date = read_attribute_before_type_cast("date")
      return unless raw_date.is_a?(String) && raw_date.present?

      unless raw_date.match?(/\A\d{4}-\d{2}-\d{2}\z/)
        errors.add(:date, "はYYYY-MM-DD形式で入力してください")
      end
    end
end
