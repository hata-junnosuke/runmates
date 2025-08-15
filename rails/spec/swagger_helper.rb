# frozen_string_literal: true

require "rails_helper"

RSpec.configure do |config|
  # Specify a root folder where Swagger JSON files are generated
  # NOTE: If you're using the rswag-api to serve API descriptions, you'll need
  # to ensure that it's configured to serve Swagger from the same folder
  config.openapi_root = Rails.root.join("swagger").to_s

  # Define one or more Swagger documents and provide global metadata for each one
  # When you run the 'rswag:specs:swaggerize' rake task, the complete Swagger will
  # be generated at the provided relative path under openapi_root
  # By default, the operations defined in spec files are added to the first
  # document below. You can override this behavior by adding a openapi_spec tag to the
  # the root example_group in your specs, e.g. describe '...', openapi_spec: 'v2/swagger.json'
  config.openapi_specs = {
    "v1/swagger.yaml" => {
      openapi: "3.0.1",
      info: {
        title: "Runmates API",
        version: "v1",
        description: "Runmates - ランニング管理アプリケーションのAPI仕様書",
      },
      paths: {},
      servers: [
        {
          url: "http://localhost:3000",
          description: "Development server",
        },
        {
          url: "https://runmates.net",
          description: "Production server",
        },
      ],
      components: {
        securitySchemes: {
          bearer_auth: {
            type: :apiKey,
            name: "access-token",
            in: :header,
            description: "DeviseTokenAuth access token",
          },
          client_auth: {
            type: :apiKey,
            name: "client",
            in: :header,
            description: "DeviseTokenAuth client token",
          },
          uid_auth: {
            type: :apiKey,
            name: "uid",
            in: :header,
            description: "DeviseTokenAuth uid (email)",
          },
        },
        schemas: {
          user: {
            type: :object,
            properties: {
              id: { type: :integer },
              email: { type: :string },
              name: { type: :string },
              created_at: { type: :string, format: :datetime },
              updated_at: { type: :string, format: :datetime },
            },
            required: ["id", "email"],
          },
          running_record: {
            type: :object,
            properties: {
              id: { type: :integer },
              date: { type: :string, format: :date },
              distance: { type: :number, format: :float },
              user_id: { type: :integer },
              created_at: { type: :string, format: :datetime },
              updated_at: { type: :string, format: :datetime },
            },
            required: ["id", "date", "distance", "user_id"],
          },
          monthly_goal: {
            type: :object,
            properties: {
              id: { type: :integer },
              year: { type: :integer },
              month: { type: :integer },
              distance_goal: { type: :number, format: :float },
              user_id: { type: :integer },
              created_at: { type: :string, format: :datetime },
              updated_at: { type: :string, format: :datetime },
            },
            required: ["id", "year", "month", "distance_goal", "user_id"],
          },
          yearly_goal: {
            type: :object,
            properties: {
              id: { type: :integer },
              year: { type: :integer },
              distance_goal: { type: :number, format: :float },
              user_id: { type: :integer },
              created_at: { type: :string, format: :datetime },
              updated_at: { type: :string, format: :datetime },
            },
            required: ["id", "year", "distance_goal", "user_id"],
          },
          error: {
            type: :object,
            properties: {
              error: { type: :string },
              errors: {
                oneOf: [
                  {
                    type: :array,
                    items: { type: :string },
                  },
                  {
                    type: :object,
                    additionalProperties: true,
                  },
                ],
              },
              success: { type: :boolean },
              status: { type: :string },
            },
          },
        },
      },
    },
  }

  # Specify the format of the output Swagger file when running 'rswag:specs:swaggerize'.
  # The openapi_specs configuration option has the filename including format in
  # the key, this may want to be changed to avoid putting yaml in json files.
  # Defaults to json. Accepts ':json' and ':yaml'.
  config.openapi_format = :yaml
end
