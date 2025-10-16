require "rails_helper"

RSpec.describe RunningRecord, type: :model do
  describe "アソシエーション" do
    it { should belong_to(:user) }
  end

  describe "バリデーション" do
    subject { build(:running_record) }

    it { should validate_presence_of(:date) }
    it { should validate_presence_of(:distance) }
    it { should validate_numericality_of(:distance).is_greater_than(0) }

    context "有効な値の場合" do
      it "有効なレコードを作成できる" do
        running_record = build(:running_record)
        expect(running_record).to be_valid
      end
    end

    context "distanceが0以下の場合" do
      it "無効になる" do
        running_record = build(:running_record, distance: 0)
        expect(running_record).not_to be_valid
        expect(running_record.errors[:distance]).to be_present
      end
    end

    context "dateが2025年未満の場合" do
      it "無効になる" do
        running_record = build(:running_record, date: Date.new(2024, 12, 31))
        expect(running_record).not_to be_valid
        expect(running_record.errors[:date]).to include("は2025年1月1日以降の日付を入力してください")
      end
    end

    context "dateの形式が不正な場合" do
      it "無効になる" do
        running_record = build(:running_record)
        running_record.assign_attributes(date: "2025/11/01")

        expect(running_record).not_to be_valid
        expect(running_record.errors[:date]).to include("はYYYY-MM-DD形式で入力してください")
      end
    end

    context "distanceが大きな値の場合" do
      it "有効になる" do
        running_record = build(:running_record, distance: 1000)
        expect(running_record).to be_valid
      end
    end

    context "distanceが境界値付近の有効な値の場合" do
      it "最小値に近い値でも有効になる" do
        running_record = build(:running_record, distance: 0.01)
        expect(running_record).to be_valid
      end
    end

    context "同じユーザーが同じ日付で複数のレコードを作成する場合" do
      it "複数のレコードを作成できる" do
        user = create(:user)
        date = Date.current
        create(:running_record, user: user, date: date, distance: 5.0)
        second_record = build(:running_record, user: user, date: date, distance: 3.0)

        expect(second_record).to be_valid
        expect { second_record.save! }.not_to raise_error
        expect(user.running_records.where(date: date).count).to eq(2)
        expect(user.running_records.where(date: date).sum(:distance)).to eq(8.0)
      end
    end
  end

  describe "スコープ" do
    let(:user) { create(:user) }
    let!(:old_record) { create(:running_record, user: user, date: Date.new(2025, 1, 15)) }
    let!(:jan_record) { create(:running_record, user: user, date: Date.new(2026, 1, 10)) }
    let!(:feb_record) { create(:running_record, user: user, date: Date.new(2026, 2, 20)) }
    let!(:latest_record) { create(:running_record, user: user, date: Date.new(2026, 12, 31)) }

    describe ".for_year" do
      it "指定された年のレコードのみを返す" do
        current_year_records = RunningRecord.for_year(2026)
        expect(current_year_records).to include(jan_record, feb_record)
        expect(current_year_records).not_to include(old_record)
      end
    end

    describe ".for_month" do
      it "指定された年月のレコードのみを返す" do
        jan_records = RunningRecord.for_month(2026, 1)
        expect(jan_records).to include(jan_record)
        expect(jan_records).not_to include(feb_record, old_record)
      end
    end

    describe ".recent" do
      it "日付の降順でソートされたレコードを返す" do
        recent_records = RunningRecord.recent
        expect(recent_records.first).to eq(latest_record)
        expect(recent_records.last).to eq(old_record)
      end
    end
  end
end
