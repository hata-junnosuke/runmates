class Api::V1::Auth::EmailConfirmationsController < Api::V1::BaseController
  skip_before_action :authenticate_user!

  def show
    token = params[:confirmation_token]
    
    if token.blank?
      redirect_to_with_error("確認トークンが必要です")
      return
    end

    # トークンからユーザーを検索
    digest = Devise.token_generator.digest(User, :pending_email_confirmation_token, token)
    user = User.find_by(pending_email_confirmation_token: digest)

    if user.nil?
      redirect_to_with_error("無効な確認トークンです")
      return
    end

    # メールアドレスを変更
    if user.confirm_email_change(token)
      redirect_to_with_success("メールアドレスが正常に変更されました")
    else
      redirect_to_with_error("メールアドレスの変更に失敗しました")
    end
  end

  private

  def redirect_to_with_success(message)
    # CGI.escape: URLのクエリパラメータとして安全に使用できるように文字列をエンコード
    # 例: "メール確認完了！" → "%E3%83%A1%E3%83%BC%E3%83%AB%E7%A2%BA%E8%AA%8D%E5%AE%8C%E4%BA%86%EF%BC%81"
    # スペース、日本語、特殊文字をURL安全な形式に変換し、XSSやURLインジェクション攻撃を防ぐ
    # allow_other_host: true → Rails7からのセキュリティ強化により、外部ホストへのリダイレクトは明示的に許可が必要
    # Next.jsフロントエンド（異なるポート/ドメイン）へのリダイレクトを可能にする
    redirect_to "#{ENV['NEXT_PUBLIC_BASE_URL']}/settings?status=success&message=#{CGI.escape(message)}", allow_other_host: true
  end

  def redirect_to_with_error(message)
    # CGI.escape: URLのクエリパラメータとして安全に使用できるように文字列をエンコード
    # 例: "エラー: 無効なトークン" → "%E3%82%A8%E3%83%A9%E3%83%BC%3A+%E7%84%A1%E5%8A%B9%E3%81%AA%E3%83%88%E3%83%BC%E3%82%AF%E3%83%B3"
    # スペース、日本語、特殊文字をURL安全な形式に変換し、XSSやURLインジェクション攻撃を防ぐ
    # allow_other_host: true → Rails7からのセキュリティ強化により、外部ホストへのリダイレクトは明示的に許可が必要
    # Next.jsフロントエンド（異なるポート/ドメイン）へのリダイレクトを可能にする
    redirect_to "#{ENV['NEXT_PUBLIC_BASE_URL']}/settings?status=error&message=#{CGI.escape(message)}", allow_other_host: true
  end
end