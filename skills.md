# TourMate — Technical Skills & Framework Reference

## Mobile Application
- **Framework**: Flutter 3.x (Dart) — cross-platform iOS + Android, native compilation
- **State Management**: Flutter BLoC with `@freezed` sealed event/state unions
- **Navigation**: GoRouter with auth redirect guards
- **HTTP Client**: Dio + Retrofit (code-generated API client)
- **Real-time**: socket_io_client (WebSocket connection to backend)
- **Maps**: google_maps_flutter + geolocator
- **Authentication**: firebase_auth (Google, Apple) + firebase_messaging (FCM push)
- **Local Storage**: hive_flutter (preferences, cache) + flutter_secure_storage (tokens)
- **DI**: get_it + injectable (code-generated dependency graph)
- **i18n**: ARB files for EN, FR, JA, ES, ZH via Flutter gen-l10n
- **Architecture**: Clean Architecture — domain/data/presentation per feature

## Backend API
- **Runtime**: Node.js 22 (LTS)
- **Framework**: Express.js 4 (factory pattern for testability)
- **Real-time**: Socket.io 4 with Redis adapter for horizontal scaling
- **Database ORM**: Knex.js (SQL query builder — not full ORM, for PostGIS raw SQL control)
- **Database**: PostgreSQL 16 + PostGIS 3.4 (spatial queries with `GEOGRAPHY` type in meters)
- **Cache / Pub-Sub**: Redis 7 (TTL caching + Socket.io multi-process adapter)
- **Authentication**: Firebase Admin SDK — `verifyIdToken()` on every protected route
- **Validation**: Joi schemas with `stripUnknown: true`
- **Rate Limiting**: rate-limiter-flexible (Redis-backed; memory fallback in dev)
- **Security**: Helmet.js (CSP, HSTS), CORS locked to `CLIENT_ORIGIN`
- **Logging**: Winston (JSON in prod, colorized in dev)
- **Push Notifications**: Firebase Cloud Messaging via firebase-admin

## Database Design Patterns
- **Geospatial**: All location columns use `GEOGRAPHY(POINT, 4326)` (not GEOMETRY)
  - `ST_DWithin(location, ST_MakePoint(lng, lat)::geography, radius_meters)` for radius queries
  - `ST_MakePoint` takes **longitude first**, then latitude (common gotcha)
  - GIST indexes on all GEOGRAPHY columns (required for performance)
- **Discount Tiers**: JSON array `[{min_participants, discount_percent}]` on `activities` table
- **Location Sharing**: Opt-in via `is_location_sharing` boolean; only active users visible
- **Review Anti-Spam**: Unique constraint on `(reviewer_id, reviewee_id, trip_context_id)`

## Infrastructure
- **Containerization**: Docker Compose (dev) with services: `postgres`, `redis`, `app`, `nginx`
- **Image**: `postgis/postgis:16-3.4` (PostGIS pre-bundled, no manual extension install)
- **Reverse Proxy**: Nginx with WebSocket upgrade headers for Socket.io
- **Cloud**: Cloud-agnostic (no AWS/GCP/Azure lock-in)

## Key Business Logic
- **Discount Calculation** (`ActivityService.calculateDiscount`):
  - Finds highest applicable tier where `min_participants <= current_participants`
  - Returns `{original_price, final_price, discount_percent, savings, next_tier, spots_to_next_discount}`
  - Called on every `JOIN` event; result broadcast via Socket.io `activity_booking_updated`
- **Shared Transport**: Transactional seat decrement with `FOR UPDATE` to prevent double-booking
- **Location Freshness**: Only users whose `updated_at > NOW() - INTERVAL '15 minutes'` appear on map

## Development Conventions
- `app.js` = Express factory (no listen); `server.js` = HTTP bind + Socket.io init
- Tests import `app.js` directly — no port conflicts across suites
- BLoC `droppable()` transformer on join/create actions prevents double-tap race conditions
- Use `Either<Failure, T>` as use-case return type (not exceptions)
- ARB strings only — no hardcoded English in widget files

## CI/CD
- Backend: GitHub Actions with PostGIS + Redis service containers
- Flutter: GitHub Actions with subosito/flutter-action, `flutter analyze` + `flutter test --coverage`
- Branch strategy: `main` (prod) → `develop` (staging) → feature branches
