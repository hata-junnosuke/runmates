require "rails_helper"

RSpec.describe RunningRecord, type: :model do
  describe "アソシエーション" do
    it { should belong_to(:user) }
  end

  describe "バリデーション" do
    subject { build(:running_record) }

    it { should validate_presence_of(:date) }
    it { should validate_presence_of(:distance) }
    it { should validate_uniqueness_of(:date).scoped_to(:user_id) }
    it { should validate_numericality_of(:distance).is_greater_than(0.1).is_less_than_or_equal_to(100.0) }

    context "有効な値の場合" do
      it "有効なレコードを作成できる" do
        running_record = build(:running_record)
        expect(running_record).to be_valid
      end
    end

    context "distanceが0.1未満の場合" do
      it "無効になる" do
        running_record = build(:running_record, distance: 0.05)
        expect(running_record).not_to be_valid
        expect(running_record.errors[:distance]).to be_present
      end
    end

    context "distanceが100.0を超える場合" do
      it "無効になる" do
        running_record = build(:running_record, distance: 101.0)
        expect(running_record).not_to be_valid
        expect(running_record.errors[:distance]).to be_present
      end
    end

    context "同じユーザーが同じ日付で複数のレコードを作成する場合" do
      it "重複エラーになる" do
        user = create(:user)
        date = Date.current
        create(:running_record, user: user, date: date)
        duplicate_record = build(:running_record, user: user, date: date)
        
        expect(duplicate_record).not_to be_valid
        expect(duplicate_record.errors[:date]).to be_present
      end
    end
  end

  describe "スコープ" do
    let(:user) { create(:user) }
    let!(:record_2023) { create(:running_record, user: user, date: Date.new(2023, 6, 15)) }
    let!(:record_2024_jan) { create(:running_record, user: user, date: Date.new(2024, 1, 10)) }
    let!(:record_2024_feb) { create(:running_record, user: user, date: Date.new(2024, 2, 20)) }
    let!(:record_latest) { create(:running_record, user: user, date: Date.current) }

    describe ".for_year" do
      it "指定された年のレコードのみを返す" do
        records_2024 = RunningRecord.for_year(2024)
        expect(records_2024).to include(record_2024_jan, record_2024_feb)
        expect(records_2024).not_to include(record_2023)
      end
    end

    describe ".for_month" do
      it "指定された年月のレコードのみを返す" do
        records_2024_jan = RunningRecord.for_month(2024, 1)
        expect(records_2024_jan).to include(record_2024_jan)
        expect(records_2024_jan).not_to include(record_2024_feb, record_2023)
      end
    end

    describe ".recent" do
      it "日付の降順でソートされたレコードを返す" do
        recent_records = RunningRecord.recent
        expect(recent_records.first).to eq(record_latest)
        expect(recent_records.last).to eq(record_2023)
      end
    end
  end
end