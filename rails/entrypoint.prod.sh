#!/bin/bash
set -e

echo "Start entrypoint.prod.sh"

echo "rm -f /myapp/tmp/pids/server.pid"
rm -f /myapp/tmp/pids/server.pid

# データベースが起動するまで待機
echo "Waiting for database..."
until bundle exec rails db:version RAILS_ENV=production 2>/dev/null; do
  >&2 echo "Database is unavailable - sleeping"
  sleep 1
done

# データベース作成（既に存在する場合はスキップ）
echo "Creating database if not exists..."
bundle exec rails db:create RAILS_ENV=production 2>/dev/null || true

echo "Running database migrations..."
bundle exec rails db:migrate RAILS_ENV=production

# SolidQueueのテーブルが存在しない場合は作成
echo "Checking SolidQueue tables..."
if ! bundle exec rails runner "puts SolidQueue::Job.table_exists?" RAILS_ENV=production 2>/dev/null | grep -q "true"; then
  echo "Creating SolidQueue tables..."
  bundle exec rails db:queue:prepare RAILS_ENV=production
fi

# シードデータ投入（初回のみ）
if bundle exec rails runner "puts User.count" RAILS_ENV=production | grep -q "0"; then
  echo "Running seed data..."
  bundle exec rails db:seed RAILS_ENV=production
fi

echo "Starting puma server..."
bundle exec puma -C config/puma.rb