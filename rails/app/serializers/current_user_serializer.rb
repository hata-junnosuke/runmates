class CurrentUserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :password, :password_confirmation
end
