require "rails_helper"

RSpec.describe RunningPlan, type: :model do
  describe "アソシエーション" do
    it { should belong_to(:user) }
  end

  describe "バリデーション" do
    subject { build(:running_plan) }

    it { should validate_presence_of(:date) }
    it { should validate_presence_of(:planned_distance) }
    it { should validate_numericality_of(:planned_distance).is_greater_than(0).is_less_than(1000) }
    it { should validate_presence_of(:status) }

    it "ステータスは定義済みの値のみ許可する" do
      plan = build(:running_plan, status: "invalid")
      expect(plan).not_to be_valid
      expect(plan.errors[:status]).to include("は一覧にありません")
    end

    context "有効な値の場合" do
      it "有効なレコードを作成できる" do
        plan = build(:running_plan)
        expect(plan).to be_valid
      end
    end

    context "planned_distanceが0以下の場合" do
      it "無効になる" do
        plan = build(:running_plan, planned_distance: 0)
        expect(plan).not_to be_valid
        expect(plan.errors[:planned_distance]).to be_present
      end
    end

    context "dateが2025年未満の場合" do
      it "無効になる" do
        plan = build(:running_plan, date: Date.new(2024, 12, 31))
        expect(plan).not_to be_valid
        expect(plan.errors[:date]).to include("は2025年1月1日以降の日付を入力してください")
      end
    end

    context "dateの形式が不正な場合" do
      it "無効になる" do
        plan = build(:running_plan)
        plan.assign_attributes(date: "2025/11/01")

        expect(plan).not_to be_valid
        expect(plan.errors[:date]).to include("はYYYY-MM-DD形式で入力してください")
      end
    end
  end

  describe "スコープ" do
    let(:user) { create(:user) }
    let!(:jan_plan) { create(:running_plan, user:, date: Date.new(2026, 1, 5)) }
    let!(:feb_plan) { create(:running_plan, user:, date: Date.new(2026, 2, 10)) }

    describe ".for_month" do
      it "指定された年月の予定のみを返す" do
        jan = RunningPlan.for_month(2026, 1)
        expect(jan).to include(jan_plan)
        expect(jan).not_to include(feb_plan)
      end
    end
  end
end
