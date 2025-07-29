#!/bin/bash
set -e

rm -f /myapp/tmp/pids/server.pid

# データベースが起動するまで待機
echo "Waiting for database..."
until bundle exec rails db:version 2>/dev/null; do
  >&2 echo "Database is unavailable - sleeping"
  sleep 1
done

# マイグレーション実行
echo "Running database migrations..."
bundle exec rails db:migrate

# SolidQueueのテーブルが存在しない場合は作成
echo "Checking SolidQueue tables..."
if ! bundle exec rails runner "SolidQueue::Job.table_exists?" 2>/dev/null; then
  echo "Creating SolidQueue tables..."
  bundle exec rails db:queue:prepare
fi

exec "$@"