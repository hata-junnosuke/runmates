#!/bin/bash
set -e

rm -f /myapp/tmp/pids/server.pid

# データベースが起動するまで待機
echo "Waiting for database..."
until bundle exec rails db:version 2>/dev/null; do
  >&2 echo "Database is unavailable - sleeping"
  sleep 1
done

# マイグレーション実行（SolidQueueテーブルも含まれる）
echo "Running database migrations..."
bundle exec rails db:migrate

exec "$@"