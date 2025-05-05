Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # ヘルスチェック用
  get "health_check" => "health_check#index"
  # Defines the root path route ("/")
  # root "posts#index"
end
