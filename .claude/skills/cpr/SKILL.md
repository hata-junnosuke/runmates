---
name: cpr
description: コミット前チェック（rspec, rubocop, lint）を実行し、成功したらブランチ作成・コミット・PR作成まで自動で行う
user-invocable: true
disable-model-invocation: true
---

## 手順

1. eslintとrubocopとrspecを実施してください
2. 成功していれば、新規ブランチを作成して、コミットして、PRを作ってください
3. issueの内容も更新してください
4. ライブラリを追加した場合はPRに用途と使い方を記載してください

## PRフォーマット

`.github/PULL_REQUEST_TEMPLATE.md` のフォーマットに従ってPRを作成すること。
タイトルはIssueテンプレートのプレフィックス（`[Feature]` or `[Bug]`）を付ける。

## 通知音について

CLAUDE.mdの通知音ルールに従うこと（途中経過では鳴らさない。PR作成完了後の最後にのみGlass音を鳴らす）。
