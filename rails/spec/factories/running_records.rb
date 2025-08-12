FactoryBot.define do
  factory :running_record do
    association :user
    sequence(:date) {|n| Date.current - n.days }
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

    trait :with_minimum_distance do
      distance { 0.2 } # バリデーションの下限に近い値
    end

    trait :with_maximum_distance do
      distance { 99.0 } # バリデーションの上限に近い値
    end

    trait :invalid_too_short do
      distance { 0.05 } # バリデーション下限より小さい
    end

    trait :invalid_too_long do
      distance { 101.0 } # バリデーション上限より大きい
    end

    trait :with_extreme_distance do
      distance { 100.0 } # バリデーション上限ぎりぎり
    end
  end
end
