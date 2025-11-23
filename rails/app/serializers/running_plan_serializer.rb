class RunningPlanSerializer < ApplicationSerializer
  attributes :id, :date, :planned_distance, :memo, :status, :created_at, :updated_at
end
