# CLAUDE.md
必ず日本語で回答してください。
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a full-stack "Runmates" application with a Rails API backend and Next.js frontend, containerized with Docker. The system uses cookie-based authentication with DeviseTokenAuth.

**Stack:**
- **Backend**: Rails API (Ruby 3.4.3) with MySQL 8.0.32
- **Frontend**: Next.js 15.3.1 with TypeScript, Tailwind CSS, and MUI
- **Authentication**: DeviseTokenAuth with HTTP-only cookies
- **Deployment**: AWS ECS Fargate with Nginx reverse proxy

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
```bash
# Frontend commands (inside next container)
npm run dev          # Development server with Turbopack
npm run build        # Production build
npm run lint         # ESLint checking
npm run format       # Auto-fix linting issues

# Backend commands (inside rails container)
rails s -b '0.0.0.0' # Start server (required for Docker)
bundle exec rspec    # Run all tests
bundle exec rspec spec/path/to/test_spec.rb  # Run single test
rubocop              # Code style checking
rails db:migrate     # Run database migrations
rails console       # Interactive console
```

### Testing
```bash
# Backend testing (Rails)
bundle exec rspec                    # All tests
bundle exec rspec spec/models/       # Model tests only
bundle exec rspec spec/requests/     # Request/API tests only
bundle exec rspec --format documentation  # Verbose output

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
- MySQL database with DeviseTokenAuth user model
- Database runs in Docker container on port 3307
- Migrations in `rails/db/migrate/`
- Test data factories in `rails/spec/factories/`

## Environment Configuration

### Development
- Rails server: localhost:3000
- Next.js frontend: localhost:8000
- MySQL database: localhost:3307
- Cookie settings: `same_site: :lax`, `secure: false`

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

### Authentication Controllers
- `rails/app/controllers/api/v1/auth/sessions_controller.rb` - Login/logout with cookie management
- `rails/app/controllers/api/v1/auth/registrations_controller.rb` - User registration

### Key Frontend Components
- `next/src/app/components/AuthWrapper.tsx` - Authentication state management
- `next/src/app/sign_in/SignInForm.tsx` - Login form
- `next/src/app/sign_up/SignUpForm.tsx` - Registration form
- `next/src/app/components/LogoutButton.tsx` - Logout functionality

## Development Notes

### Docker Usage
- All development happens inside containers
- Use `docker compose exec [service] /bin/bash` to access container shells
- Rails server must bind to `0.0.0.0` (not localhost) for Docker networking
- Frontend and backend can be developed independently

### Authentication Debugging
- Sessions controller includes debug logging for token generation
- Check Rails logs for authentication flow debugging
- Cookies can be inspected in browser DevTools

### Code Style
- Rails: Uses RuboCop with Rails and RSpec configurations
- Next.js: Uses ESLint with Next.js configuration
- Both have auto-fix capabilities (`rubocop -a`, `npm run format`)

### Common Issues
- If node_modules is empty, delete it and run `npm i` inside container
- Rails server requires `-b '0.0.0.0'` flag for Docker
- CORS issues: Check `rails/config/initializers/cors.rb` for allowed origins