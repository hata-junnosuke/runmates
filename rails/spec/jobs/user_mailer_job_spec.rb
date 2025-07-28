require "rails_helper"

RSpec.describe UserMailerJob, type: :job do
  include ActiveJob::TestHelper

  let(:user) { create(:user) }
  let(:token) { "test_token_123" }

  describe "#perform" do
    context "ウェルカムメール送信" do
      it "ウェルカムメールを送信すること" do
        # UserMailer.welcome_email(user)が呼ばれることを期待
        # and_call_original: モックしつつ、実際のメソッドも実行する
        # これにより、実際のMessageDeliveryオブジェクトが生成される
        allow(UserMailer).to receive(:welcome_email).with(user).and_call_original

        # ActionMailer::MessageDeliveryは、メール送信を遅延実行するためのラッパークラス
        # allow_any_instance_of: 実行時に生成される任意のインスタンスに対するスタブを設定
        # deliver_nowメソッドが呼ばれることで、実際にメールが送信される
        mail_delivery = instance_double(ActionMailer::MessageDelivery)
        allow(UserMailer).to receive(:welcome_email).and_return(mail_delivery)
        allow(mail_delivery).to receive(:deliver_now)

        # ジョブを実行
        UserMailerJob.new.perform("welcome_email", user)

        # have_receivedで事後検証（MessageSpiesパターン）
        expect(UserMailer).to have_received(:welcome_email).with(user)
        expect(mail_delivery).to have_received(:deliver_now)
      end
    end

    context "パスワードリセットメール送信" do
      it "パスワードリセットメールを送信すること" do
        mail_delivery = instance_double(ActionMailer::MessageDelivery)
        allow(UserMailer).to receive(:password_reset).with(user, token).and_return(mail_delivery)
        allow(mail_delivery).to receive(:deliver_now)

        UserMailerJob.new.perform("password_reset", user, token)

        expect(UserMailer).to have_received(:password_reset).with(user, token)
        expect(mail_delivery).to have_received(:deliver_now)
      end
    end

    context "確認メール送信" do
      it "確認メールを送信すること" do
        mail_delivery = instance_double(ActionMailer::MessageDelivery)
        allow(UserMailer).to receive(:confirmation_email).with(user, token).and_return(mail_delivery)
        allow(mail_delivery).to receive(:deliver_now)

        UserMailerJob.new.perform("confirmation_email", user, token)

        expect(UserMailer).to have_received(:confirmation_email).with(user, token)
        expect(mail_delivery).to have_received(:deliver_now)
      end
    end

    context "不明なアクション" do
      it "エラーログを出力すること" do
        allow(Rails.logger).to receive(:error)

        UserMailerJob.new.perform("invalid_action", user)

        expect(Rails.logger).to have_received(:error).with("Unknown mailer action: invalid_action")
      end
    end

    context "エラーハンドリング" do
      it "エラーログを出力して例外を再発生させること" do
        # allowはスタブの設定（expectと違い、呼ばれなくてもテストは失敗しない）
        # and_raise: メソッドが呼ばれたときに例外を発生させる
        allow(UserMailer).to receive(:welcome_email).and_raise(StandardError, "Test error")
        allow(Rails.logger).to receive(:error)

        # ブロック内のコードが指定された例外を発生させることを期待
        # rescueで捕捉後、raiseで再発生させることを確認
        expect {
          UserMailerJob.new.perform("welcome_email", user)
        }.to raise_error(StandardError, "Test error")

        # have_receivedで事後検証
        expect(Rails.logger).to have_received(:error).with("Failed to send email: Test error")
        expect(Rails.logger).to have_received(:error).at_least(:once) # バックトレース出力の確認
      end
    end
  end

  describe "ジョブのエンキュー" do
    it "mailersキューにジョブがエンキューされること" do
      # perform_laterでジョブがキューに追加されることを検証
      expect {
        UserMailerJob.perform_later("welcome_email", user)
      }.to have_enqueued_job(UserMailerJob). # UserMailerJobがエンキューされる
             with("welcome_email", user).          # 引数が正しい
             on_queue("mailers")                   # mailersキューに追加される
    end
  end
end
