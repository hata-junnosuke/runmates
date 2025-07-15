class RunningRecordSerializer < ActiveModel::Serializer
  attributes :id, :date, :distance, :created_at, :updated_at

  def created_at
    object.created_at&.in_time_zone("Asia/Tokyo")&.strftime("%Y/%m/%d %H:%M")
  end

  def updated_at
    object.updated_at&.in_time_zone("Asia/Tokyo")&.strftime("%Y/%m/%d %H:%M")
  end
end
