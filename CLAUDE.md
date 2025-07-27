# CLAUDE.md
必ず日本語で回答してください。
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ 重要: コマンド実行規則

**すべてのRailsおよびNext.jsコマンドは必ずDockerコンテナ内で実行してください。**

❌ **間違った例（絶対に実行しない）:**
- `bundle exec rubocop`
- `rails console`
- `npm run dev`
- `rspec`
- `rails db:migrate`

✅ **正しい例（必ずこの形式で実行）:**
- `docker-compose exec rails bundle exec rubocop`
- `docker-compose exec rails rails console`
- `docker-compose exec next npm run dev`
- `docker-compose exec rails bundle exec rspec`
- `docker-compose exec rails rails db:migrate`

**Claudeへの指示: 例外なく、すべてのコマンドは`docker-compose exec`を通じて実行すること。**

## Architecture Overview

This is a full-stack "Runmates" running management application with a Rails API backend and Next.js frontend, containerized with Docker. The system provides comprehensive running record tracking, goal setting, and data visualization features.

**Stack:**
- **Backend**: Rails API (Ruby 3.4.3) with MySQL 8.0.32
- **Frontend**: Next.js 15.3.1 with TypeScript, Tailwind CSS, MUI, and Chart.js
- **Authentication**: DeviseTokenAuth with HTTP-only cookies
- **Data Visualization**: Chart.js + react-chartjs-2 for modern charts
- **Deployment**: AWS ECS Fargate with Nginx reverse proxy

**Core Features:**
- Running record management with calendar interface
- Monthly and yearly goal setting and tracking
- Interactive data visualization with progress charts
- Responsive UI with modern design patterns

## Development Commands

### Initial Setup
```bash
# Clone and build containers
docker compose build --no-cache
docker compose up

# Frontend setup (in new terminal)
docker compose exec next /bin/bash
npm i
npm run dev  # Starts on localhost:8000

# Backend setup (in new terminal)
docker compose run --rm rails bundle install
docker compose exec rails /bin/bash
rails s -b '0.0.0.0'  # Starts on localhost:3000
```

### Daily Development

**重要: 全てのコマンドはDockerコンテナ内で実行してください**

```bash
# Frontend commands (Docker経由で実行)
docker-compose exec next npm run dev          # Development server with Turbopack
docker-compose exec next npm run build        # Production build
docker-compose exec next npm run lint         # ESLint checking
docker-compose exec next npm run format       # Auto-fix linting issues

# Backend commands (Docker経由で実行)
docker-compose exec rails rails s -b '0.0.0.0' # Start server (required for Docker)
docker-compose exec rails bundle exec rspec    # Run all tests
docker-compose exec rails bundle exec rspec spec/path/to/test_spec.rb  # Run single test
docker-compose exec rails bundle exec rubocop  # Code style checking
docker-compose exec rails rails db:migrate     # Run database migrations
docker-compose exec rails rails console        # Interactive console
```

### Testing
```bash
# Backend testing (Rails) - Docker経由で実行
docker-compose exec rails bundle exec rspec                    # All tests
docker-compose exec rails bundle exec rspec spec/models/       # Model tests only
docker-compose exec rails bundle exec rspec spec/requests/     # Request/API tests only
docker-compose exec rails bundle exec rspec --format documentation  # Verbose output

# No frontend tests currently configured
```

## Key Architecture Patterns

### Authentication Flow
1. User submits credentials via React forms (SignInForm/SignUpForm)
2. Frontend sends requests to Rails API (`/api/v1/auth/`)
3. Rails validates and generates DeviseTokenAuth tokens
4. Rails sets HTTP-only cookies with `access-token`, `client`, and `uid`
5. Subsequent requests automatically include cookies
6. Rails validates tokens from cookies for protected routes

**Important**: Authentication uses cookies, not localStorage. Tokens are HTTP-only for XSS protection.

### API Structure
- All API endpoints under `/api/v1/` namespace
- Routes defined in `rails/config/routes.rb`
- Controllers in `rails/app/controllers/api/v1/`
- Serializers in `rails/app/serializers/` for JSON responses

### Frontend Structure
- Next.js App Router with TypeScript
- Authentication utilities split between:
  - `next/src/lib/client-auth.ts` - Client-side auth functions
  - `next/src/lib/server-auth.ts` - Server-side auth functions
- Forms use React Hook Form with validation
- AuthWrapper component handles authentication state

### Database
- MySQL database with comprehensive running management schema:
  - `users` - DeviseTokenAuth managed user accounts
  - `running_records` - Daily running distance records
  - `monthly_goals` - Monthly distance goals with year/month constraints
  - `yearly_goals` - Annual distance goals with unique constraints
- Database runs in Docker container on port 3307
- Migrations in `rails/db/migrate/`
- Test data factories in `rails/spec/factories/`

## Environment Configuration

### Development
- Rails server: localhost:3000
- Next.js frontend: localhost:8000
- MySQL database: localhost:3307
- Cookie settings: `same_site: :lax`, `secure: false`

**Environment Variables (.env.development):**
```bash
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
INTERNAL_API_URL=http://host.docker.internal:3000/api/v1
NEXT_PUBLIC_BASE_URL=http://localhost:8000

# Backend (Rails)
MYSQL_DATABASE=runmates_development
DEVISE_SECRET_KEY=<auto-generated>
```

### Production
- Domain: `runmates.net`
- Cookie settings: `same_site: :none`, `secure: true`
- Deployed on AWS ECS Fargate
- Nginx reverse proxy configuration

## Important Files

### Configuration
- `rails/config/routes.rb` - API routing
- `rails/config/initializers/cors.rb` - CORS settings
- `rails/config/initializers/devise_token_auth.rb` - Auth configuration
- `next/src/lib/client-auth.ts` - Client authentication utilities
- `next/src/lib/server-auth.ts` - Server authentication utilities

### Backend Controllers
#### Authentication
- `rails/app/controllers/api/v1/auth/sessions_controller.rb` - Login/logout with cookie management
- `rails/app/controllers/api/v1/auth/registrations_controller.rb` - User registration

#### Running Management API
- `rails/app/controllers/api/v1/running_records_controller.rb` - CRUD for running records
- `rails/app/controllers/api/v1/running_statistics_controller.rb` - Statistics calculation
- `rails/app/controllers/api/v1/monthly_goals_controller.rb` - Monthly goals management
- `rails/app/controllers/api/v1/current_monthly_goals_controller.rb` - Current month goal API
- `rails/app/controllers/api/v1/yearly_goals_controller.rb` - Yearly goals management
- `rails/app/controllers/api/v1/current_yearly_goal_controller.rb` - Current year goal API

#### Models & Data
- `rails/app/models/running_record.rb` - Running record model with validations
- `rails/app/models/monthly_goal.rb` - Monthly goal model with scopes
- `rails/app/models/yearly_goal.rb` - Yearly goal model with constraints

### Key Frontend Components
#### Authentication
- `next/src/app/components/AuthWrapper.tsx` - Authentication state management
- `next/src/app/sign_in/SignInForm.tsx` - Login form
- `next/src/app/sign_up/SignUpForm.tsx` - Registration form
- `next/src/app/components/LogoutButton.tsx` - Logout functionality

#### Dashboard & Data Visualization
- `next/src/app/components/ServerRunningDashboard.tsx` - Main dashboard with statistics
- `next/src/app/components/DashboardWithCalendar.tsx` - Calendar and form management
- `next/src/app/components/RunningChart.tsx` - Chart.js visualization component
- `next/src/app/components/RunningChartWrapper.tsx` - SSR-safe chart wrapper

#### Running Management
- `next/src/app/components/ClientRunningCalendar.tsx` - Interactive calendar for date selection
- `next/src/app/components/ClientRecordForm.tsx` - Running record entry form
- `next/src/app/components/ClientGoalForm.tsx` - Monthly goal setting form
- `next/src/app/components/ClientYearlyGoalForm.tsx` - Yearly goal setting form

#### Server Actions & API Integration
- `next/src/app/actions/running-actions.ts` - Server actions for data mutations
- `next/src/lib/api.ts` - Client-side API utilities
- `next/src/lib/server-api.ts` - Server-side API utilities

## Git Workflow Guidelines

### ブランチ命名規則

**⚠️ CRITICAL: Vercelの自動デプロイを防ぐため、以下のブランチ命名規則を厳守してください:**

**必ず`feature/`プレフィックスを使用:**
- ✅ `feature/add-user-profile` - 新機能追加
- ✅ `feature/fix-login-error` - バグ修正（`fix/`ではなく）
- ✅ `feature/refactor-api-calls` - リファクタリング
- ✅ `feature/update-dependencies` - 依存関係の更新

**使用してはいけないプレフィックス:**
- ❌ `fix/` - Vercelの自動デプロイがトリガーされる
- ❌ `hotfix/` - Vercelの自動デプロイがトリガーされる
- ❌ `bugfix/` - Vercelの自動デプロイがトリガーされる
- ❌ `chore/` - Vercelの自動デプロイがトリガーされる

**理由:** `vercel.json`の設定により、`feature/*`ブランチのみデプロイが無効化されています。

### 重要: コミット前の確認プロセス

**⚠️ CRITICAL: `git add` コマンドを実行する前に必ず以下を実施してください:**

1. 作業が完了したら「作業完了しました」と報告
2. ユーザーが変更内容を確認
3. ユーザーの承認を得てから `git add` を実行

**禁止事項:**
- ❌ 自動的に `git add -A` を実行しない
- ❌ ユーザーの確認なしに変更をステージングしない
- ❌ 作業完了の報告なしにコミット作業を進めない

**正しい手順:**
```bash
# 1. 作業完了を報告（Claudeが実行）
# "作業完了しました。変更内容は以下の通りです..."

# 2. ユーザーが確認・承認

# 3. 承認後にaddとcommit（Claudeが実行）
git add -A
git status
git commit -m "..."
```

## Development Notes

### 🚨 必須チェック項目（毎回実行）

**CRITICAL: Claude は全ての変更後、必ず以下の3つのチェックを実行してください。コミット・プッシュ前に必須です。**

**⚠️ 重要な指示: この順序で必ず実行し、全てがパスすることを確認してからコミットしてください**

```bash
# 1. RSpec（テスト実行） - 必須
docker-compose exec rails bundle exec rspec

# 2. RuboCop（コードスタイルチェック） - 必須  
docker-compose exec rails bundle exec rubocop

# 3. ESLint（フロントエンドリント） - 必須
docker-compose exec next npm run lint
```

**自動修正も利用可能:**
```bash
# RuboCop自動修正
docker-compose exec rails bundle exec rubocop -a

# ESLint自動修正
docker-compose exec next npm run format
```

### Docker Usage
- **重要**: 全ての開発作業はDockerコンテナ内で実行する
- ローカルでコマンドを実行せず、必ず `docker-compose exec [service] [command]` を使用する
- シェルアクセス: `docker-compose exec [service] /bin/bash`
- Rails server must bind to `0.0.0.0` (not localhost) for Docker networking
- Frontend and backend can be developed independently

**よくある間違い:**
- ❌ `cd rails && bundle exec rubocop` (ローカル実行)
- ✅ `docker-compose exec rails bundle exec rubocop` (Docker実行)

### Authentication Debugging
- Sessions controller includes debug logging for token generation
- Check Rails logs for authentication flow debugging
- Cookies can be inspected in browser DevTools

### Code Style
- Rails: Uses RuboCop with Rails and RSpec configurations
- Next.js: Uses ESLint with Next.js configuration
- Both have auto-fix capabilities (Docker経由で実行):
  - `docker-compose exec rails bundle exec rubocop -a`
  - `docker-compose exec next npm run format`

### Common Issues & Solutions

#### Development Setup
- If node_modules is empty, delete it and run `npm i` inside container
- Rails server requires `-b '0.0.0.0'` flag for Docker networking
- CORS issues: Check `rails/config/initializers/cors.rb` for allowed origins

#### Authentication & API
- Server-side API calls use `INTERNAL_API_URL` (host.docker.internal)
- Client-side API calls use `NEXT_PUBLIC_API_URL` (localhost)
- Authentication relies on HTTP-only cookies, not localStorage
- Check ApplicationController for cookie-to-header conversion logic

#### Chart.js & SSR
- Chart.js components must be dynamically imported to avoid SSR issues
- Use RunningChartWrapper for SSR-safe chart rendering
- EmotionCache is configured in ThemeRegistry for Material-UI consistency

#### Database & Migrations
- Ensure proper database constraints are applied via migrations
- Use `docker-compose exec rails rails db:migrate` after pulling new migration files
- Check `rails/db/schema.rb` for current database structure

### Claude専用: コマンド実行ルール

1. **絶対にローカルでRailsやNode.jsコマンドを実行しない**
2. **すべてのコマンドは`docker-compose exec`経由で実行する**
3. **例外なし - テスト、リント、マイグレーション、すべてDockerコンテナ内で実行**
4. **ローカル環境にRubyやNode.jsがインストールされていないことを前提とする**

**コマンド実行時の思考プロセス:**
- まず「このコマンドはRailsかNext.js関連か？」を確認
- 関連する場合は必ず`docker-compose exec [service]`を前置
- serviceは`rails`または`next`を使用

### Claude専用: トークン使用量削減ガイドライン

**⚠️ CRITICAL: トークン使用量を最小限に抑えるため、以下のガイドラインを厳守してください:**

#### 1. ファイル読み取りの最適化
- **部分読み取りを活用**: 大きなファイルは`offset`と`limit`パラメータを使用
- **必要な部分のみ読む**: ファイル全体が必要でない場合は該当箇所のみ
- **関連性の低いファイルは読まない**: タスクに直接関係ないファイルはスキップ

```bash
# ❌ 非効率な例
Read entire file (2000+ lines)

# ✅ 効率的な例
Read file with offset: 100, limit: 50
```

#### 2. レスポンスの簡潔化
- **説明は最小限に**: コードの動作説明は不要（ユーザーが要求した場合のみ）
- **繰り返しを避ける**: 同じ内容を複数回説明しない
- **結果のみ報告**: 「〜を実行します」→ 実行 → 「〜を実行しました」は不要

#### 3. 検索とテストの効率化
```bash
# ❌ 非効率
docker-compose exec rails bundle exec rspec  # 全テスト

# ✅ 効率的
docker-compose exec rails bundle exec rspec spec/models/user_spec.rb  # 特定テストのみ
```

#### 4. ツールの並列実行
- **複数の独立したタスクは一度に実行**: Bash、Grep、Readなどを並列使用
- **関連ファイルは一度に読む**: 複数ファイルの読み取りをバッチ化

#### 5. 明確な要件確認
- **曖昧な指示には短く確認**: 長い推測より短い質問
- **具体的なエラーメッセージやファイルパスを要求**
- **XY問題を避ける**: ユーザーの真の目的を理解

#### 6. 出力の最適化
- **コードブロックは必要最小限**: 変更箇所のみ表示
- **差分形式を活用**: 全体ではなく変更点のみ
- **要約を活用**: 長いログは要点のみ抽出

#### 7. コンテキスト管理
- **完了タスクの詳細は保持しない**: 結果のみ記憶
- **重要情報はCLAUDE.mdに記録**: 繰り返し参照する情報のみ
- **長い会話は区切る**: 必要に応じて要約して再開を提案