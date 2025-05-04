# Load the Rails application.
require_relative "application"

# Initialize the Rails application.
Rails.application.initialize!

Rails.application.config.active_support.to_time_preserves_timezone = :offset