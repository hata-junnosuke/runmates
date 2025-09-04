Rails.application.routes.draw do
  # 開発環境用エンジン
  if defined?(Rswag)
    mount Rswag::Ui::Engine => "/api-docs"
    mount Rswag::Api::Engine => "/api-docs"
  end
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?

  # API v1ルート
  namespace :api do
    namespace :v1 do
      # ヘルスチェックと認証
      get "health_check", to: "health_check#index"
      mount_devise_token_auth_for "User", at: "auth", controllers: {
        sessions: "api/v1/auth/sessions",
        registrations: "api/v1/auth/registrations",
        passwords: "api/v1/auth/passwords",
        confirmations: "api/v1/auth/confirmations",
      }
      get "auth/email_confirmation", to: "auth/email_confirmations#show"

      # ユーザー管理
      namespace :current do
        resource :user, only: [:show, :update, :destroy]
      end

      # ランニング記録
      resources :running_records
      resource :running_statistics, only: [:show]

      # 目標管理
      resources :monthly_goals
      resource :current_monthly_goal, only: [:show, :create], controller: "current_monthly_goal"
      resources :yearly_goals
      resource :current_yearly_goal, only: [:show, :create], controller: "current_yearly_goal"
    end
  end
end
