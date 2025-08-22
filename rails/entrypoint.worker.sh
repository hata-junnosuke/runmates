#!/bin/bash
set -e

echo "Start entrypoint.worker.sh"

# bundle installを実行
echo "Installing dependencies..."
bundle install

# データベースが起動するまで待機
echo "Waiting for database..."
until bundle exec rails db:version 2>/dev/null; do
  >&2 echo "Database is unavailable - sleeping"
  sleep 1
done

# SolidQueueのテーブルが存在するまで待機
echo "Waiting for SolidQueue tables..."
until bundle exec rails runner "exit(SolidQueue::Job.table_exists? ? 0 : 1)" 2>/dev/null; do
  >&2 echo "SolidQueue tables are not ready - sleeping"
  sleep 2
done

echo "Starting SolidQueue worker..."
exec bundle exec rake solid_queue:start