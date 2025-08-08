## Implementation

1. npm auditで脆弱性チェック
   - package.jsonの依存関係の既知の脆弱性を検査
   - 脆弱性の重要度別（critical, high, moderate, low）に集計
2. ESLintでセキュリティ/アクセシビリティチェック
   - eslint-plugin-securityによるセキュリティ問題の検出
   - eslint-plugin-jsx-a11yによるアクセシビリティ問題の検出
3. 問題が見つかった場合
   - 各警告の詳細と修正方法を表示
   - ファイルパスと行番号を明確に示す

## 通知音について

チェック完了時に通知音を鳴らします：
```bash
afplay /System/Library/Sounds/Glass.aiff
```