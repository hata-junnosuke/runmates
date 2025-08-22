#!/bin/bash
set -e

rm -f /myapp/tmp/pids/server.pid

# データベースが起動するまで待機
echo "Waiting for database..."
until bundle exec rails db:version 2>/dev/null; do
  >&2 echo "Database is unavailable - sleeping"
  sleep 1
done

# 開発環境では手動でマイグレーションを管理するため、自動実行はしない
# 必要に応じて以下のコマンドを手動で実行:
# docker-compose exec rails bundle exec rails db:migrate
echo "Database connection established."

exec "$@"