require "rails_helper"

RSpec.describe MonthlyGoal, type: :model do
  describe "アソシエーション" do
    it { should belong_to(:user) }
  end

  describe "バリデーション" do
    subject { build(:monthly_goal) }

    it { should validate_presence_of(:year) }
    it { should validate_presence_of(:month) }
    it { should validate_numericality_of(:year).is_greater_than_or_equal_to(2020).is_less_than_or_equal_to(2050) }
    it { should validate_inclusion_of(:month).in_range(1..12) }
    it { should validate_numericality_of(:distance_goal).is_greater_than(0).allow_nil }
    it { should validate_uniqueness_of(:user_id).scoped_to([:year, :month]) }

    context "有効な値の場合" do
      it "有効なレコードを作成できる" do
        monthly_goal = build(:monthly_goal)
        expect(monthly_goal).to be_valid
      end
    end

    context "yearが範囲外の場合" do
      it "2020未満の場合は無効になる" do
        monthly_goal = build(:monthly_goal, year: 2019)
        expect(monthly_goal).not_to be_valid
        expect(monthly_goal.errors[:year]).to be_present
      end

      it "2050を超える場合は無効になる" do
        monthly_goal = build(:monthly_goal, year: 2051)
        expect(monthly_goal).not_to be_valid
        expect(monthly_goal.errors[:year]).to be_present
      end
    end

    context "monthが範囲外の場合" do
      it "1未満の場合は無効になる" do
        monthly_goal = build(:monthly_goal, month: 0)
        expect(monthly_goal).not_to be_valid
        expect(monthly_goal.errors[:month]).to be_present
      end

      it "12を超える場合は無効になる" do
        monthly_goal = build(:monthly_goal, month: 13)
        expect(monthly_goal).not_to be_valid
        expect(monthly_goal.errors[:month]).to be_present
      end
    end

    context "distance_goalのバリデーション" do
      it "0以下の場合は無効になる" do
        monthly_goal = build(:monthly_goal, distance_goal: 0)
        expect(monthly_goal).not_to be_valid
        expect(monthly_goal.errors[:distance_goal]).to be_present
      end

      it "大きな値でも有効になる" do
        monthly_goal = build(:monthly_goal, distance_goal: 1000.0)
        expect(monthly_goal).to be_valid
      end

      it "nilの場合は有効になる" do
        monthly_goal = build(:monthly_goal, distance_goal: nil)
        expect(monthly_goal).to be_valid
      end
    end

    context "同じユーザーが同じ年月で複数の目標を作成する場合" do
      it "重複エラーになる" do
        user = create(:user)
        create(:monthly_goal, user: user, year: 2024, month: 6)
        duplicate_goal = build(:monthly_goal, user: user, year: 2024, month: 6)

        expect(duplicate_goal).not_to be_valid
        expect(duplicate_goal.errors[:user_id]).to be_present
      end
    end
  end

  describe "スコープ" do
    let(:user) { create(:user) }
    let!(:current_month_goal) { create(:monthly_goal, user: user, year: Date.current.year, month: Date.current.month) }
    let!(:previous_month_goal) { create(:monthly_goal, :for_previous_month, user: user) }

    describe ".for_current_month" do
      it "現在の年月の目標のみを返す" do
        current_goals = MonthlyGoal.for_current_month
        expect(current_goals).to include(current_month_goal)
        expect(current_goals).not_to include(previous_month_goal)
      end
    end
  end
end
