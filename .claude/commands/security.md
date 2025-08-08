## Implementation

1. Rails側のセキュリティチェックを実行
   - bundle-auditで脆弱性チェック
   - brakemanでセキュリティスキャン
2. Next.js側のセキュリティチェックを実行
   - npm auditで脆弱性チェック
   - ESLintでセキュリティ/アクセシビリティチェック
3. 結果のサマリーを表示
   - 検出された問題の数を集計
   - 重要度別に分類して表示

## 通知音について

チェック完了時に通知音を鳴らします：
```bash
afplay /System/Library/Sounds/Glass.aiff
```