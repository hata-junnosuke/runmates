Rails.application.routes.draw do
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
  namespace :api do
    namespace :v1 do
      get "health_check", to: "health_check#index"
      mount_devise_token_auth_for "User", at: "auth", controllers: {
        sessions: "api/v1/auth/sessions",
        registrations: "api/v1/auth/registrations",
      }

      namespace :current do
        resource :user, only: [:show]
      end
      
      resources :running_records do
        collection do
          get :statistics
        end
      end
      
      resources :monthly_goals do
        collection do
          get :current
          post :upsert
        end
      end
    end
  end
end
