#!/bin/bash
set -e

echo "Start entrypoint.prod.sh"

# Puma を single mode（WEB_CONCURRENCY=0）で起動する。
# cluster mode（worker >= 1）だと master プロセスに Rails/SolidQueue がロードされず、
# config/puma.rb の `plugin :solid_queue` が fork する supervisor で
# `uninitialized constant SolidQueue` が発生してワーカーが起動できないため。
export WEB_CONCURRENCY=${WEB_CONCURRENCY:-0}
export RAILS_MAX_THREADS=${RAILS_MAX_THREADS:-2}

echo "rm -f /myapp/tmp/pids/server.pid"
rm -f /myapp/tmp/pids/server.pid

# データベースが起動するまで待機
# echo "Waiting for database..."
# until bundle exec rails db:version RAILS_ENV=production 2>/dev/null; do
#   >&2 echo "Database is unavailable - sleeping"
#   sleep 1
# done

# データベースのセットアップ（作成とマイグレーション）
# SolidQueueテーブルもマイグレーションファイルから作成される
echo "Setting up database..."
bundle exec rails db:prepare RAILS_ENV=production

# シードデータ投入（初回のみ）
if bundle exec rails runner "puts User.count" RAILS_ENV=production | grep -q "0"; then
  echo "Running seed data..."
  bundle exec rails db:seed RAILS_ENV=production
fi

echo "Starting puma server..."
bundle exec puma -C config/puma.rb
