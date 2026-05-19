#!/bin/bash
set -euo pipefail

# Claude Code PreToolUse hook: git commit時にrspec/rubocop/lintを実行
# 通常の端末からのgit commitでは発火しない

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
