Rails.application.routes.draw do
  mount Rswag::Ui::Engine => "/api-docs"
  mount Rswag::Api::Engine => "/api-docs"
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
  namespace :api do
    namespace :v1 do
      get "health_check", to: "health_check#index"
      mount_devise_token_auth_for "User", at: "auth", controllers: {
        sessions: "api/v1/auth/sessions",
        registrations: "api/v1/auth/registrations",
        passwords: "api/v1/auth/passwords",
        confirmations: "api/v1/auth/confirmations",
      }

      namespace :current do
        resource :user, only: [:show, :destroy]
      end

      resources :running_records
      resource :running_statistics, only: [:show]

      resources :monthly_goals
      resource :current_monthly_goal, only: [:show, :create], controller: "current_monthly_goal"

      resources :yearly_goals
      resource :current_yearly_goal, only: [:show, :create], controller: "current_yearly_goal"
    end
  end
end
