## Implementation

1. リントとテストを実施
2. リントとテストが成功していれば、新規ブランチを作成して、コミットして、PRを作って

## 通知音について

このコマンドでも、git add実行前には必ず通知音（Submarine音）を鳴らします：
```bash
afplay /System/Library/Sounds/Submarine.aiff
```

これは`.claude/hooks/notification-sounds.md`の設定に従っています。