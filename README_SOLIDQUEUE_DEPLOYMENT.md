# SolidQueue本番環境デプロイメントガイド

## 概要
SolidQueueは、Railsアプリケーションのバックグラウンドジョブを処理するためのデータベースベースのキューシステムです。本番環境では、ワーカープロセスを別途起動する必要があります。

## データベース構成

### オプション1: 同じDBを使用（現在の設定）
**メリット:**
- シンプルな構成
- 管理が簡単
- コストが低い

**デメリット:**
- アプリケーションとジョブキューが同じDBを使うため、負荷が集中する
- ジョブ処理がアプリケーションのパフォーマンスに影響する可能性

**推奨シナリオ:**
- 小〜中規模のアプリケーション
- ジョブ量が少ない
- コストを抑えたい

### オプション2: DBを分離（推奨）
**設定方法:**
1. 別のRDSインスタンスを作成
2. `config/environments/production.rb`で以下のコメントを外す：
```ruby
config.solid_queue.connects_to = { database: { writing: :queue } }
```
3. 環境変数に`QUEUE_DATABASE_URL`を設定

**メリット:**
- アプリケーションとジョブキューの負荷が分離される
- それぞれ独立してスケールできる
- 障害の影響範囲を限定できる

**デメリット:**
- 管理するDBが増える
- コストが上がる

**推奨シナリオ:**
- 大規模アプリケーション
- ジョブ処理が多い
- 高可用性が必要

## ローカル開発環境

### 起動方法
```bash
# すべてのコンテナを起動（ワーカー含む）
docker-compose up

# または個別に起動
docker-compose up -d db rails next
docker-compose up worker
```

## 本番環境（AWS ECS）

### 1. ECRにイメージをプッシュ
```bash
# Railsイメージをビルド・プッシュ（ワーカーも同じイメージを使用）
cd rails
docker build -t runmates-rails .
docker tag runmates-rails:latest YOUR_ECR_URI/runmates-rails:latest
docker push YOUR_ECR_URI/runmates-rails:latest
```

### 2. ECSタスク定義を作成
```bash
# ワーカー用タスク定義を登録
aws ecs register-task-definition --cli-input-json file://ecs-task-definition-worker.json
```

### 3. ECSサービスを作成
```bash
# ワーカーサービスを作成（1つのタスクを常時起動）
aws ecs create-service \
  --cluster runmates-cluster \
  --service-name runmates-worker \
  --task-definition runmates-worker:1 \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

### 4. スケーリング設定（オプション）
高負荷時にワーカーを自動スケールさせる場合：

```bash
# Auto Scalingターゲットを作成
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/runmates-cluster/runmates-worker \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 1 \
  --max-capacity 5

# CPU使用率に基づくスケーリングポリシーを作成
aws application-autoscaling put-scaling-policy \
  --policy-name runmates-worker-cpu-scaling \
  --service-namespace ecs \
  --resource-id service/runmates-cluster/runmates-worker \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    }
  }'
```

## 監視とログ

### CloudWatchログ
ワーカーのログは `/ecs/runmates-worker` ログググループに出力されます。

### ヘルスチェック
ワーカープロセスが正常に動作しているかを確認：
```bash
ps aux | grep solid_queue
```

### メトリクス監視
- CPU使用率
- メモリ使用率
- ジョブ処理数（カスタムメトリクス）

## トラブルシューティング

### ワーカーが起動しない場合
1. データベース接続を確認
2. 環境変数が正しく設定されているか確認
3. SolidQueueのテーブルが作成されているか確認

### ジョブが処理されない場合
1. ワーカーのログを確認
2. `solid_queue_jobs`テーブルの内容を確認
3. `solid_queue_failed_executions`テーブルでエラーを確認

## 設定ファイル

### config/solid_queue.yml
本番環境の設定を調整できます：
- ワーカー数
- スレッド数
- ポーリング間隔

### config/recurring.yml
定期実行ジョブの設定（必要に応じて）