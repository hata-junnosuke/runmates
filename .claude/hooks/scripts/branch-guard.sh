#!/usr/bin/env bash
# branch-guard.sh
# イベント: UserPromptSubmit
# 役割: ブランチ命名規則(CLAUDE.md)違反 や main 直作業を警告する。
# 入力: stdin に JSON({ prompt, ... })。
# 終了コード: 0(ブロックしない)。stdout に出した文字列は Claude の文脈に追加される。
#
# なぜ: main 直編集は事故の元。また Runmates は feature/* / fix/* / refactor/* の
#       3 種類のみを許可しているため、それ以外の命名を見つけたら注意喚起する。
#       強制ブロックではなく気づきを与える方針。

command -v git >/dev/null 2>&1 || exit 0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null)"
[ -z "$BRANCH" ] && exit 0

case "$BRANCH" in
  main|master)
    echo "[branch-guard] 現在のブランチは '$BRANCH' です。直接編集は避け、作業用ブランチ(feature/* | fix/* | refactor/*)を切ることを検討してください。"
    ;;
  feature/*|fix/*|refactor/*|HEAD)
    # OK: 規約準拠 or detached HEAD は無視
    :
    ;;
  *)
    echo "[branch-guard] 現在のブランチ '$BRANCH' は Runmates の命名規則(feature/* | fix/* | refactor/*)から外れています。CLAUDE.md を確認し、必要なら正しい命名のブランチに切り替えてください。"
    ;;
esac

exit 0
