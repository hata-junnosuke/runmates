threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }.to_i
threads threads_count, threads_count
environment ENV.fetch("RAILS_ENV") { "development" }
plugin :tmp_restart

# 本番のみ Puma プロセス内で SolidQueue ワーカーを同居起動する。
# development は docker-compose の worker コンテナがジョブを処理するため有効化しない（二重起動防止）。
plugin :solid_queue if ENV.fetch("RAILS_ENV") { "development" } == "production"

app_root = File.expand_path("..", __dir__)
bind "unix://#{app_root}/tmp/sockets/puma.sock"
