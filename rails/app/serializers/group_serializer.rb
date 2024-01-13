class GroupSerializer < ActiveModel::Serializer
  attributes :id, :name, :introduction, :image, :owner_id, :created_at, :updated_at
end
