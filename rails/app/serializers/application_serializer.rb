class ApplicationSerializer < ActiveModel::Serializer
  private

    def format_ts(value)
      value&.in_time_zone("Asia/Tokyo")&.strftime("%Y/%m/%d %H:%M")
    end

    def created_at
      format_ts(object.created_at)
    end

    def updated_at
      format_ts(object.updated_at)
    end
end
