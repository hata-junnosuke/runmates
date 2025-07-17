require "rails_helper"

RSpec.describe UserMailer, type: :mailer do
  let(:user) { create(:user, email: "test@example.com", name: "テストユーザー") }

  describe "#welcome_email" do
    let(:mail) { UserMailer.welcome_email(user) }

    it "正しい件名でメールを送信すること" do
      expect(mail.subject).to eq("【Runmates】会員登録が完了しました")
    end

    it "正しい宛先にメールを送信すること" do
      expect(mail.to).to eq([user.email])
    end

    it "正しい送信元からメールを送信すること" do
      expect(mail.from).to eq(["no-replay@example.com"])
    end

    it "ユーザー名を含むこと" do
      # HTML部分とテキスト部分の両方をチェック
      expect(mail.html_part.body.encoded).to include(user.name)
      expect(mail.text_part.body.encoded).to include(user.name)
    end

    it "アプリケーション名を含むこと" do
      expect(mail.html_part.body.encoded).to include("Runmates")
      expect(mail.text_part.body.encoded).to include("Runmates")
    end

    it "アプリケーションへのリンクを含むこと" do
      expect(mail.html_part.body.encoded).to include("http://localhost:8000")
      expect(mail.text_part.body.encoded).to include("http://localhost:8000")
    end
  end

  describe "#password_reset" do
    let(:reset_token) { "sample_reset_token_123" }
    let(:mail) { UserMailer.password_reset(user, reset_token) }

    it "正しい件名でメールを送信すること" do
      expect(mail.subject).to eq("【Runmates】パスワードリセットのご案内")
    end

    it "正しい宛先にメールを送信すること" do
      expect(mail.to).to eq([user.email])
    end

    it "正しい送信元からメールを送信すること" do
      expect(mail.from).to eq(["no-replay@example.com"])
    end

    it "ユーザー名を含むこと" do
      expect(mail.html_part.body.encoded).to include(user.name)
      expect(mail.text_part.body.encoded).to include(user.name)
    end

    it "リセットトークンを含むリンクを含むこと" do
      expect(mail.html_part.body.encoded).to include(reset_token)
      expect(mail.html_part.body.encoded).to include("/reset_password?token=#{reset_token}")
      expect(mail.text_part.body.encoded).to include(reset_token)
      expect(mail.text_part.body.encoded).to include("/reset_password?token=#{reset_token}")
    end

    it "有効期限の警告を含むこと" do
      expect(mail.html_part.body.encoded).to include("24")
      expect(mail.text_part.body.encoded).to include("24")
    end
  end
end
