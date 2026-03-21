# Architecture

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│                   React 19 + Vite                            │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Grid    │  │  Detail  │  │ Roadmap  │  │   Quiz   │   │
│  │  View    │  │  Panel   │  │  Modal   │  │  Modal   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Hooks: useLanguages, useRoadmap, useAuth             │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ /api/*
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     Nginx (Production)                       │
│              Static files + API proxy                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        Backend                               │
│                    Laravel 12                                 │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐    │
│  │ Controllers│  │   Models   │  │  Artisan Commands  │    │
│  │            │  │            │  │                    │    │
│  │ Language   │  │ Language   │  │ metrics:fetch      │    │
│  │ Roadmap    │  │ Roadmap    │  │ roadmap:import     │    │
│  │ Auth       │  │ RoadmapPath│  │ roadmap:import-paths│   │
│  │ Metrics    │  │ User       │  │ languages:enrich   │    │
│  │ Progress   │  │ UserProgress│ │                    │    │
│  └────────────┘  └────────────┘  └────────────────────┘    │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐    │
│  │  Filament  │  │  Horizon   │  │    Scheduler       │    │
│  │  Admin     │  │  Queues    │  │  (metrics weekly)  │    │
│  └────────────┘  └────────────┘  └────────────────────┘    │
└───────┬──────────────────┬──────────────────────────────────┘
        │                  │
        ▼                  ▼
┌──────────────┐  ┌──────────────┐
│    MySQL     │  │    Redis     │
│              │  │              │
│  languages   │  │  Cache       │
│  roadmaps    │  │  Sessions    │
│  roadmap_paths│ │  Queues      │
│  users       │  │              │
│  user_progress│ │              │
└──────────────┘  └──────────────┘
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19 + Vite | SPA with component-based UI |
| UI Library | React Flow (@xyflow/react) | Roadmap graph visualization |
| Backend | Laravel 12 | REST API + admin panel |
| Admin | Filament v5 | Language/roadmap management |
| Auth | Laravel Sanctum | Token-based API authentication |
| Queue | Laravel Horizon + Redis | Background job processing |
| Database | MySQL 8.0 | Persistent data storage |
| Cache | Redis 7 | Caching, sessions, queues |
| Web Server | Nginx (prod) / Vite proxy (dev) | Static files + API proxy |
| CI/CD | GitHub Actions | Automated testing and Docker builds |
| AI | Claude API (Anthropic) | Roadmap generation (optional) |

## Key Design Decisions

### 1. Roadmaps as JSON in Database
Roadmap data (phases, topics, resources) is stored as JSON columns in MySQL rather than normalized tables. This simplifies the API response (single query returns the full roadmap) and makes it easy to import/export as files.

### 2. Metrics from Scraping
TIOBE rankings are scraped weekly instead of using a paid API. Stack Overflow survey data is hardcoded from the annual public report. A fallback dataset ensures the app works even if scraping fails.

### 3. Non-blocking Metrics
The frontend loads languages independently of metrics. If the metrics API fails, languages still render — metrics are optional enhancements (TIOBE rank badges, SO loved/used percentages).

### 4. Content Generated via Claude Max
All 120 roadmaps, 654 paths, and language enrichments were generated using Claude Code (Claude Max subscription) instead of the Claude API. This saved API credits while producing high-quality, structured content.

### 5. Seeders for Production Data
Generated content (879 JSON files) lives in `database/seeders/data/` and is committed to the repository. Running `php artisan db:seed` recreates all roadmaps and paths from scratch, making deployments reproducible.

### 6. Configurable Admin Path
The Filament admin panel path is configurable via `FILAMENT_PATH` environment variable (default: `manage-ptl`). This provides security through obscurity — the default `/admin` path returns 404.

## Data Flow

### Language Data
```
LanguageSeeder (JSON) → MySQL languages table → GET /api/languages → Frontend Grid
```

### Roadmap Data
```
JSON files → roadmap:import → MySQL roadmaps table → GET /api/roadmap/{lang} → Frontend RoadmapModal
```

### Path Details
```
JSON files → roadmap:import-paths → MySQL roadmap_paths table → GET /api/roadmap/{lang}/path/{id} → Frontend TopicPanel
```

### Metrics
```
TIOBE website ──┐
                 ├→ metrics:fetch → storage/app/metrics.json → GET /api/metrics → Frontend badges
SO Survey data ──┘
```

### User Progress
```
Frontend (mark topic complete) → POST /api/progress → MySQL user_progress → synced across devices
```

## Directory Structure

```
periodic-table-langs/
├── .github/workflows/ci.yml        # GitHub Actions CI pipeline
├── docker-compose.yml               # Production Docker setup
├── docker-compose.dev.yml           # Development Docker setup
├── .env.example                     # Production env template
│
├── frontend/
│   ├── Dockerfile                   # Production (nginx + static build)
│   ├── Dockerfile.dev               # Development (Vite dev server)
│   ├── nginx.conf                   # Production nginx config
│   ├── vite.config.js               # Vite config with API proxy
│   └── src/
│       ├── components/              # React components
│       │   ├── Cell.jsx             # Language grid cell
│       │   ├── DetailPanel.jsx      # Language detail sidebar
│       │   ├── RoadmapModal.jsx     # Roadmap viewer with React Flow
│       │   ├── QuizModal.jsx        # Language recommendation quiz
│       │   └── ...
│       ├── hooks/                   # Custom React hooks
│       │   ├── useLanguages.js      # Fetch languages + metrics
│       │   ├── useRoadmap.js        # Fetch roadmap + progress
│       │   └── useAuth.js           # Authentication state
│       └── data/                    # Static data (categories, icons)
│
├── backend/
│   ├── Dockerfile                   # Production (PHP + cron)
│   ├── Dockerfile.dev               # Development (PHP artisan serve)
│   ├── docker-entrypoint.sh         # Production startup script
│   ├── app/
│   │   ├── Console/Commands/        # Artisan commands
│   │   ├── Filament/                # Admin panel resources
│   │   ├── Http/Controllers/        # API controllers
│   │   ├── Jobs/                    # Queue jobs (roadmap generation)
│   │   └── Models/                  # Eloquent models
│   ├── database/
│   │   └── seeders/
│   │       ├── data/                # 879 JSON files for seeding
│   │       │   ├── roadmaps/        # 120 core roadmaps
│   │       │   ├── roadmap-paths/   # 654 path details
│   │       │   └── language-enrichments/ # 105 enrichment files
│   │       ├── LanguageSeeder.php
│   │       ├── RoadmapSeeder.php
│   │       ├── RoadmapPathSeeder.php
│   │       └── LanguageEnrichmentSeeder.php
│   ├── routes/
│   │   ├── api.php                  # API routes
│   │   └── console.php             # Scheduled tasks
│   └── scripts/
│       └── generate-all.sh          # Bulk roadmap generation
│
└── docs/
    ├── API.md                       # API documentation
    ├── ARCHITECTURE.md              # This file
    ├── DATABASE.md                  # Database schema
    └── screenshots/                 # App screenshots
```
