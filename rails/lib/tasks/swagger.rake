namespace :swagger do
  desc "Export Swagger documentation as static files"
  task export: :environment do
    require "fileutils"

    # Swagger YAMLファイルのパス
    swagger_file = Rails.root.join("swagger", "v1", "swagger.yaml")

    # 出力先ディレクトリ
    output_dir = Rails.public_path.join("api-docs-static")

    # ディレクトリを作成
    FileUtils.mkdir_p(output_dir)

    # YAMLファイルをコピー
    FileUtils.cp(swagger_file, output_dir.join("swagger.yaml"))

    puts "Swagger documentation exported to #{output_dir}"
    puts "You can now share the swagger.yaml file or host it on:"
    puts "  - GitHub Pages"
    puts "  - Swagger Hub (https://swagger.io/tools/swaggerhub/)"
    puts "  - Postman Documentation (https://www.postman.com/api-documentation-tool/)"
    puts "  - ReadMe.io (https://readme.com/)"
  end

  desc "Generate standalone HTML documentation"
  task generate_html: :environment do
    Rails.root.join("swagger", "v1", "swagger.yaml")
    output_file = Rails.public_path.join("api-documentation.html")

    # Redoc CDNを使用したスタンドアロンHTML
    html_content = <<~HTML
      <!DOCTYPE html>
      <html>
        <head>
          <title>Runmates API Documentation</title>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { margin: 0; padding: 0; }
          </style>
        </head>
        <body>
          <redoc spec-url='/api-docs/v1/swagger.yaml'></redoc>
          <script src="https://cdn.jsdelivr.net/npm/redoc/bundles/redoc.standalone.js"></script>
        </body>
      </html>
    HTML

    File.write(output_file, html_content)
    puts "HTML documentation generated at #{output_file}"
  end
end
