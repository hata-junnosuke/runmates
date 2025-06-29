Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins Settings.front_domain, "https://runmates-two.vercel.app"

    resource "*",
             headers: :any,
             expose: ["access-token", "uid", "client"],
             methods: [:get, :post, :put, :patch, :delete, :options, :head],
             credentials: true
  end
end
