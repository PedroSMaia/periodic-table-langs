# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-03-21

### Features
- **Periodic table grid** — 120 programming languages organized by category with filtering, keyboard navigation, and search (⌘K)
- **Language detail panel** — paradigm, year, description, links, tutorials, frameworks, tools, and packages
- **AI-powered roadmaps** — structured learning paths with phases and topics for all 120 languages
- **654 specialization paths** — Django, React, Spring Boot, Unity, and hundreds more with detailed content
- **Progress tracking** — mark topics as complete, syncs across devices with user accounts
- **Roadmap comparison** — compare two language roadmaps side by side
- **Quiz mode** — interactive quiz to find your ideal programming language
- **Popularity mode** — languages ranked by TIOBE index with Stack Overflow stats
- **Authentication** — register and log in with Laravel Sanctum
- **Dark / Light mode** — theme toggle

### Content
- 120 language roadmaps with 3250+ topics
- 654 specialization paths (frameworks, libraries, tools)
- 133 frameworks, 343 tools, 385 packages, 615 tutorials enriching language details
- TIOBE rankings and Stack Overflow Developer Survey 2024 data

### Infrastructure
- React 19 + Vite frontend with React Flow for roadmap graphs
- Laravel 12 + Filament v5 backend with Horizon queue management
- MySQL + Redis with Docker Compose (dev and production)
- GitHub Actions CI/CD pipeline
- Production-ready Docker images with nginx, cron scheduler, and auto-migrations
- Configurable admin panel path for security

### Commands
- `metrics:fetch` — scrape TIOBE index and merge with Stack Overflow data
- `roadmap:import` — import roadmap JSON files into database
- `roadmap:import-paths` — import path detail JSON files
- `languages:enrich` — enrich language data with frameworks, tools, packages
- Database seeders for reproducible production deployment

## [0.1.0] - 2026-03-15

### Initial Release
- Project scaffolding with React + Vite frontend and Laravel backend
- Docker development environment
- Language data seeder with 120 programming languages
- Basic periodic table grid with category filtering
