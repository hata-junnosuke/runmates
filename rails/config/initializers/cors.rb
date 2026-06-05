Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(
      Rails.application.credentials.dig(Rails.env.to_sym, :frontend_url) ||
        "http://localhost:8000",
    )

    resource "*",
             headers: :any,
             expose: ["access-token", "uid", "client"],
             methods: [:get, :post, :put, :patch, :delete, :options, :head],
             credentials: true
  end
end
