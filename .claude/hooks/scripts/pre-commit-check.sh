#!/usr/bin/env bash
set -euo pipefail

# pre-commit-check.sh
# イベント: PreToolUse(matcher: Bash)
# 役割: tool_input.command が `git commit ...` のときだけ rspec/rubocop/lint/tsc を実行し、
#       失敗したらコミットをブロックする。通常端末からの git commit では発火しない。
# 入力: stdin に JSON({ tool_input: { command } })。
# 終了コード: 0=許可(allow JSON を返す) / 0+deny JSON=ブロック(permissionDecision: deny)。
#
# なぜ自力でゲート判定するか:
#   settings.json の matcher は "Bash" 単位でしか絞れず(コマンド引数までは絞れない)、
#   本フックは Claude が Bash を叩くたびに毎回発火する。判定なしで通すと `ls` や
#   `cat foo` 1 つにつき rspec/rubocop/lint/tsc が走って数分待たされてしまう。
#   そこで stdin の tool_input.command を覗いて、`git commit ...` 以外は即 exit 0 で
#   素通りさせ、本当に重いチェックが必要な瞬間だけ後続処理に進む。

INPUT="$(cat)"

if command -v jq >/dev/null 2>&1; then
  CMD=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // ""')
else
  CMD=$(printf '%s' "$INPUT" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("tool_input",{}).get("command",""))')
fi

echo "$CMD" | grep -qE '^git commit([[:space:]]|$)' || exit 0

deny() {
  local reason="$1"
  local output="$2"
  echo "$output" >&2
  jq -n --arg reason "$reason" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $reason
    }
  }'
  exit 0
}

# RSpec
RSPEC_OUT=$(docker compose exec -T rails bundle exec rspec 2>&1) || deny "RSpec failed. Fix test failures before committing." "$RSPEC_OUT"
RSPEC_SUMMARY=$(echo "$RSPEC_OUT" | grep -E '^[0-9]+ examples?' | tail -1 || true)
RSPEC_SUMMARY="${RSPEC_SUMMARY:-OK}"

# Rubocop
RUBOCOP_OUT=$(docker compose exec -T rails bundle exec rubocop 2>&1) || deny "Rubocop failed. Fix lint violations before committing." "$RUBOCOP_OUT"
RUBOCOP_SUMMARY=$(echo "$RUBOCOP_OUT" | grep -E 'files? inspected' | tail -1 || true)
RUBOCOP_SUMMARY="${RUBOCOP_SUMMARY:-OK}"

# Next.js lint
LINT_OUT=$(docker compose exec -T next npm run lint 2>&1) || deny "Next.js lint failed. Fix lint errors before committing." "$LINT_OUT"

# Next.js 型チェック（npm run lint には含まれないため、ビルドを落とす型エラーをここで検出）
TSC_OUT=$(docker compose exec -T next npx tsc --noEmit 2>&1) || deny "TypeScript type check failed. Fix type errors before committing (this would break next build)." "$TSC_OUT"

# All checks passed
SUMMARY="All checks passed. [RSpec] $RSPEC_SUMMARY [Rubocop] $RUBOCOP_SUMMARY [Lint] OK [tsc] OK"
jq -n --arg ctx "$SUMMARY" '{
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    permissionDecision: "allow",
    additionalContext: $ctx
  }
}'
