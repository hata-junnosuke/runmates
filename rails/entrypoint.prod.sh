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

# データベースのセットアップ（作成とマイグレーション）
# SolidQueueテーブルもマイグレーションファイルから作成される
echo "Setting up database..."
bundle exec rails db:prepare RAILS_ENV=production

# シードデータ投入（初回のみ）
if bundle exec rails runner "puts User.count" RAILS_ENV=production | grep -q "0"; then
  echo "Running seed data..."
  bundle exec rails db:seed RAILS_ENV=production
fi

echo "Starting SolidQueue worker in background..."
bundle exec rake solid_queue:start &
WORKER_PID=$!
echo "SolidQueue worker started with PID: $WORKER_PID"

# ワーカーが起動するまで少し待つ
sleep 3

echo "Starting puma server..."
bundle exec puma -C config/puma.rb