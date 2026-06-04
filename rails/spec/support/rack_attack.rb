# frozen_string_literal: true

# デフォルトでRack::Attackを無効化（既存テストに影響しない）
Rack::Attack.enabled = false

RSpec.configure do |config|
  config.before(:each, :rack_attack) do
    Rack::Attack.enabled = true
    Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new
    # 固定時間窓（fixed window）の境界跨ぎによるflakyを防ぐため時刻を固定する
    freeze_time
  end

  config.after(:each, :rack_attack) do
    Rack::Attack.reset!
    Rack::Attack.enabled = false
  end
end
