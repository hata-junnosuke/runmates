FactoryBot.define do
  factory :monthly_goal do
    user
    year { Date.current.year }
    month { Date.current.month }
    distance_goal { 100.0 }

    trait :for_previous_month do
      month { 1.month.ago.month }
      year { 1.month.ago.year }
    end

    trait :with_low_goal do
      distance_goal { 50.0 }
    end

    trait :with_medium_low_goal do
      distance_goal { 80.0 }
    end
  end
end
