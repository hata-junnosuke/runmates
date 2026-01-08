FactoryBot.define do
  factory :running_record do
    user
    sequence(:date) {|n| Date.new(2025, 1, 1) + n.days }
    distance { 5.0 }

    trait :with_past_date do
      date { Date.new(2025, 1, 1) }
    end

    trait :with_long_distance do
      distance { 20.0 }
    end

    trait :with_short_distance do
      distance { 1.0 }
    end

    trait :with_minimum_distance do
      distance { 0.01 } # バリデーションの下限に近い値
    end

    trait :with_extreme_distance do
      distance { 100.0 } # 大きな値のテスト
    end
  end
end
