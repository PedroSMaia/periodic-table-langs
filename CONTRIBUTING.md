# Contributing

Thanks for your interest in contributing to the Periodic Table of Programming Languages! Here's how you can help.

## Reporting Issues

Found a bug or something that doesn't look right? [Open an issue](https://github.com/PedroSMaia/periodic-table-langs/issues/new) with:

- What you expected to happen
- What actually happened
- Browser and device info
- Screenshots if applicable

## Suggesting Content

### Links & Tutorials

If a language is missing useful links, tutorials, or resources:

1. Open an issue titled `[Content] Add resources for {Language Name}`
2. Include the URLs and a brief description of each
3. Specify which section: `links`, `tutorials`, `frameworks`, `tools`, or `packages`

### Language Data Corrections

If you spot incorrect data (wrong year, paradigm, description):

1. Open an issue titled `[Data] Fix {Language Name} — {what's wrong}`
2. Include the correct information with a source

### Roadmap Improvements

If a roadmap topic has incorrect information, broken links, or missing content:

1. Open an issue titled `[Roadmap] Improve {Language Name} — {topic}`
2. Describe what should be changed and why

## Code Contributions

### Setup

1. Fork the repository
2. Clone your fork
3. Follow the [Local Development](README.md#local-development) guide in the README
4. Create a feature branch: `git checkout -b feature/your-feature`

### Development Workflow

```bash
# Start the dev environment
docker compose -f docker-compose.dev.yml up -d

# Backend — install dependencies
docker compose -f docker-compose.dev.yml run --rm backend composer install

# Frontend — install dependencies
docker exec periodic-table-langs-frontend-1 npm install

# Run backend tests
docker exec periodic-table-langs-backend-1 php artisan test

# Run frontend build check
docker exec periodic-table-langs-frontend-1 npm run build
```

### Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR
- Write a clear description of what changed and why
- Make sure the CI pipeline passes (backend tests + frontend build)
- Update documentation if your change affects the API or setup

### Code Style

- **PHP**: Follow PSR-12. Use `php-cs-fixer` if available
- **JavaScript/React**: Follow existing patterns. Functional components with hooks
- **Commits**: Use conventional commit messages (`feat:`, `fix:`, `docs:`, `chore:`)

## What We're Looking For

- Bug fixes
- Broken link fixes
- New tutorials or resource links for existing languages
- Improved descriptions or roadmap content
- Accessibility improvements
- Performance optimizations
- Translation support (future feature)

## What We're NOT Looking For

- Adding new programming languages (the current 120 are curated)
- Major architectural changes without prior discussion
- Features that require significant ongoing maintenance

## Questions?

Open a [discussion](https://github.com/PedroSMaia/periodic-table-langs/issues) or reach out via the repo's issue tracker.
