FactoryBot.define do
  factory :yearly_goal do
    association :user
    year { Date.current.year }
    distance_goal { 1200.0 }

    trait :for_previous_year do
      year { Date.current.year - 1 }
    end

    trait :with_high_goal do
      distance_goal { 1800.0 }
    end

    trait :with_low_goal do
      distance_goal { 600.0 }
    end
  end
end
