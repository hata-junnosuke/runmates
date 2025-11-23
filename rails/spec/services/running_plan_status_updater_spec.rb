require "rails_helper"

RSpec.describe RunningPlanStatusUpdater do
  let(:user) { create(:user) }
  let(:date) { Date.new(2025, 1, 10) }

  describe ".call" do
    context "実績がない場合" do
      it "すべてplannedのまま維持する" do
        plan = create(:running_plan, user:, date:, planned_distance: 5.0, status: "planned")

        RunningPlanStatusUpdater.call(user:, date:)

        expect(plan.reload.status).to eq("planned")
      end
    end

    context "実績を部分的に満たす場合" do
      it "partialに更新する" do
        plan = create(:running_plan, user:, date:, planned_distance: 10.0, status: "planned")
        create(:running_record, user:, date:, distance: 5.0)

        RunningPlanStatusUpdater.call(user:, date:)

        expect(plan.reload.status).to eq("partial")
      end
    end

    context "実績が予定距離を満たした場合" do
      it "completedに更新する" do
        plan = create(:running_plan, user:, date:, planned_distance: 7.0, status: "planned")
        create(:running_record, user:, date:, distance: 7.0)

        RunningPlanStatusUpdater.call(user:, date:)

        expect(plan.reload.status).to eq("completed")
      end
    end

    context "実績が複数の予定にまたがる場合" do
      it "作成順に距離を充当してステータスを更新する" do
        first_plan = create(:running_plan, user:, date:, planned_distance: 5.0, status: "planned", created_at: 1.day.ago)
        second_plan = create(:running_plan, user:, date:, planned_distance: 5.0, status: "planned")
        create(:running_record, user:, date:, distance: 7.0)

        RunningPlanStatusUpdater.call(user:, date:)

        expect(first_plan.reload.status).to eq("completed")
        expect(second_plan.reload.status).to eq("partial")
      end
    end
  end
end
