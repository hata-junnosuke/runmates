# GitHub Issue/PR テンプレート参照ガイド

## 重要な指示
Claude Codeは、このリポジトリでIssueやPRを作成する際、必ず以下のテンプレートを参考にしてください。

## Issueテンプレート

### バグレポート
- ファイル: `.github/ISSUE_TEMPLATE/bug_report.md`
- タイトルプレフィックス: `[Bug] `
- ラベル: `bug`
- 必須項目: バグの概要、再現手順、期待される動作、実際の動作、環境情報

### 機能要望
- ファイル: `.github/ISSUE_TEMPLATE/feature_request.md`
- タイトルプレフィックス: `[Feature] `
- ラベル: `enhancement`
- 必須項目: 概要、背景・目的、詳細な仕様

## PRテンプレート
- ファイル: `.github/PULL_REQUEST_TEMPLATE.md`
- 必須項目:
  - 概要
  - 関連Issue（`Fixes #番号` 形式）
  - 変更内容のチェックリスト
  - 動作確認のチェックリスト
  - レビューポイント

## 使用例

### Issue作成時
```bash
gh issue create --title "[Bug] ログイン時にエラーが発生" --body "テンプレートの内容に従って記載"
```

### PR作成時
```bash
gh pr create --title "機能追加: ダークモード対応" --body "テンプレートの内容に従って記載"
```

## 注意事項
- テンプレートは日本語で記載されているため、Issue/PRも日本語で作成すること
- 関連するIssueがある場合は必ず紐付けること
- スクリーンショットが必要な場合は添付すること
- ライブラリを追加した場合はPRに用途と使い方を記載すること
- 各操作（git add、git commit、git push、PR作成）の前に必ず通知音を鳴らすこと：
```bash
afplay /System/Library/Sounds/Submarine.aiff
```

これは`.claude/hooks/notification-sounds.md`の設定に従っています。