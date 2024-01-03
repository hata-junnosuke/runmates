class RecordSerializer < ActiveModel::Serializer
  attributes :id, distance, date, comment
  belongs_to :user, serializer: UserSerializer
end
