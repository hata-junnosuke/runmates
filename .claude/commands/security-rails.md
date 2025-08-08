## Implementation

1. bundle-auditで脆弱性チェック
   - Gemfileの依存関係の既知の脆弱性を検査
   - CVE番号と詳細情報を表示
2. brakemanでセキュリティスキャン
   - Railsアプリケーションのセキュリティ問題を検査
   - SQLインジェクション、XSS、CSRF等の脆弱性を検出
3. 問題が見つかった場合
   - 脆弱性の詳細と推奨される対処法を表示
   - 緊急度を明確に示す

## 通知音について

チェック完了時に通知音を鳴らします：
```bash
afplay /System/Library/Sounds/Glass.aiff
```