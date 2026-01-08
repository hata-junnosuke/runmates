FactoryBot.define do
  factory :running_plan do
    user
    sequence(:date) {|n| Date.new(2025, 1, 1) + n.days }
    planned_distance { 5.0 }
    memo { "マイランプラン" }
    status { "planned" }
  end
end
