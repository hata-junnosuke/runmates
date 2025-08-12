FactoryBot.define do
  factory :yearly_goal do
    association :user
    year { Date.current.year }
    distance_goal { 1200.0 }

    trait :for_previous_year do
      year { Date.current.year - 1 }
    end

    trait :with_medium_low_goal do
      distance_goal { 500.0 }
    end

    trait :with_medium_goal do
      distance_goal { 1000.0 }
    end

    trait :with_medium_low_goal_alt do
      distance_goal { 800.0 }
    end
  end
end
