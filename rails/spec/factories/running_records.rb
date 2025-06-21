FactoryBot.define do
  factory :running_record do
    association :user
    sequence(:date) { |n| Date.current - n.days }
    distance { 5.0 }

    trait :with_past_date do
      date { 1.week.ago }
    end

    trait :with_long_distance do
      distance { 20.0 }
    end

    trait :with_short_distance do
      distance { 1.0 }
    end
  end
end