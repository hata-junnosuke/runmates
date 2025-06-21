require "rails_helper"

RSpec.describe YearlyGoal, type: :model do
  describe "アソシエーション" do
    it { should belong_to(:user) }
  end

  describe "バリデーション" do
    subject { build(:yearly_goal) }

    it { should validate_presence_of(:year) }
    it { should validate_presence_of(:distance_goal) }
    it { should validate_numericality_of(:year).is_in(2020..2050) }
    it { should validate_numericality_of(:distance_goal).is_greater_than(50.0).is_less_than_or_equal_to(2000.0) }
    it { should validate_uniqueness_of(:user_id).scoped_to(:year) }

    context "有効な値の場合" do
      it "有効なレコードを作成できる" do
        yearly_goal = build(:yearly_goal)
        expect(yearly_goal).to be_valid
      end
    end

    context "yearが範囲外の場合" do
      it "2020未満の場合は無効になる" do
        yearly_goal = build(:yearly_goal, year: 2019)
        expect(yearly_goal).not_to be_valid
        expect(yearly_goal.errors[:year]).to be_present
      end

      it "2050を超える場合は無効になる" do
        yearly_goal = build(:yearly_goal, year: 2051)
        expect(yearly_goal).not_to be_valid
        expect(yearly_goal.errors[:year]).to be_present
      end
    end

    context "distance_goalが範囲外の場合" do
      it "50.0以下の場合は無効になる" do
        yearly_goal = build(:yearly_goal, distance_goal: 50.0)
        expect(yearly_goal).not_to be_valid
        expect(yearly_goal.errors[:distance_goal]).to be_present
      end

      it "2000.0を超える場合は無効になる" do
        yearly_goal = build(:yearly_goal, distance_goal: 2001.0)
        expect(yearly_goal).not_to be_valid
        expect(yearly_goal.errors[:distance_goal]).to be_present
      end
    end

    context "同じユーザーが同じ年で複数の目標を作成する場合" do
      it "重複エラーになる" do
        user = create(:user)
        create(:yearly_goal, user: user, year: 2024)
        duplicate_goal = build(:yearly_goal, user: user, year: 2024)

        expect(duplicate_goal).not_to be_valid
        expect(duplicate_goal.errors[:user_id]).to be_present
      end
    end
  end

  describe "スコープ" do
    let(:user) { create(:user) }
    let!(:current_year_goal) { create(:yearly_goal, user: user, year: Date.current.year) }
    let!(:previous_year_goal) { create(:yearly_goal, user: user, year: Date.current.year - 1) }

    describe ".for_current_year" do
      it "現在の年の目標のみを返す" do
        current_goals = YearlyGoal.for_current_year
        expect(current_goals).to include(current_year_goal)
        expect(current_goals).not_to include(previous_year_goal)
      end
    end
  end
end
