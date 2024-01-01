class ApplicationController < ActionController::Base
  include DeviseTokenAuth::Concerns::SetUserByToken
  include DeviseHackFakeSession

  skip_before_action :verify_authenticity_token
end
