# Database Schema

MySQL 8.0 — database name: `ptl`

## Entity Relationship Diagram

```
┌─────────────────────┐       ┌─────────────────────┐
│       users          │       │   user_progress      │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │──┐    │ id (PK)             │
│ name                │  │    │ user_id (FK)    ────┘
│ email (UNIQUE)      │  │    │ language             │
│ password            │       │ completed_topics (JSON)
│ remember_token      │       │ selected_path_id     │
│ created_at          │       │ created_at           │
│ updated_at          │       │ updated_at           │
└─────────────────────┘       └─────────────────────┘

┌─────────────────────┐       ┌─────────────────────┐
│     languages        │       │      roadmaps        │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │       │ id (PK)             │
│ sym                 │       │ language (UNIQUE)    │
│ name                │───────│ data (JSON)          │
│ cat                 │ name  │ generated_at         │
│ year                │       │ created_at           │
│ paradigm            │       │ updated_at           │
│ desc                │       └─────────────────────┘
│ links (JSON)        │
│ tutorials (JSON)    │       ┌─────────────────────┐
│ frameworks (JSON)   │       │   roadmap_paths      │
│ tools (JSON)        │       ├─────────────────────┤
│ packages (JSON)     │       │ id (PK)             │
│ package_manager (JSON)      │ language        ────┘
│ created_at          │ name  │ path_id              │
│ updated_at          │       │ data (JSON)          │
└─────────────────────┘       │ generated_at         │
                              │ created_at           │
                              │ updated_at           │
                              └─────────────────────┘
```

## Tables

### languages

The core table containing all 120 programming languages.

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint PK | Auto-increment ID |
| `sym` | varchar(10) | Element symbol (e.g., "Py", "Js", "Rs") |
| `name` | varchar(255) | Full language name |
| `cat` | varchar(255) | Category: `systems`, `scripting`, `oop`, `functional`, `data`, `esoteric`, `logic`, `educational`, `markup`, `hardware` |
| `year` | smallint | Year created |
| `paradigm` | varchar(255) | Paradigm description (e.g., "Multi-paradigm · General") |
| `desc` | text | Short description |
| `links` | JSON | External links: `{docs, spec, wiki, github, reddit, playground, stackoverflow, discord}` |
| `tutorials` | JSON | Array of `{name, url}` |
| `frameworks` | JSON | Array of `{name, url, desc}` |
| `tools` | JSON | Array of `{name, url, desc}` — linters, formatters, debuggers, IDEs |
| `packages` | JSON | Array of `{name, url, desc}` — libraries and packages |
| `package_manager` | JSON | `{name, url}` — e.g., `{"name": "pip / PyPI", "url": "https://pypi.org/"}` |

### roadmaps

Core learning roadmap for each language.

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint PK | Auto-increment ID |
| `language` | varchar(255) UNIQUE | Language name (matches `languages.name`) |
| `data` | JSON | Roadmap content (see structure below) |
| `generated_at` | timestamp | When the roadmap was generated |

**`data` JSON structure:**
```json
{
  "status": "ready",
  "core": [
    {
      "id": "core-1",
      "label": "Phase Label",
      "description": "Phase description",
      "topics": [
        {
          "id": "core-1-1",
          "label": "Topic Name",
          "description": "What to learn and why",
          "type": "required|optional|advanced",
          "resources": ["https://url1.com", "https://url2.com"]
        }
      ]
    }
  ],
  "paths": [
    {
      "id": "path-django",
      "label": "Django",
      "icon": "🟢",
      "category": "Web Frameworks",
      "category_icon": "🌐"
    }
  ]
}
```

### roadmap_paths

Detailed content for each specialization path.

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint PK | Auto-increment ID |
| `language` | varchar(255) | Language name |
| `path_id` | varchar(255) | Path identifier (e.g., "path-django") |
| `data` | JSON | Path content with phases and topics |
| `generated_at` | timestamp | When the path was generated |

**Unique constraint:** `(language, path_id)`

**`data` JSON structure:**
```json
{
  "status": "ready",
  "language": "Python",
  "path_id": "path-django",
  "label": "Django",
  "description": "Full-stack web framework",
  "icon": "🟢",
  "category": "Web Frameworks",
  "category_icon": "🌐",
  "phases": [
    {
      "id": "path-django-phase-1",
      "label": "Django Basics",
      "description": "Project setup and fundamentals",
      "topics": [...]
    }
  ]
}
```

### users

User accounts for progress tracking.

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint PK | Auto-increment ID |
| `name` | varchar(255) | Display name |
| `email` | varchar(255) UNIQUE | Email address |
| `password` | varchar(255) | Hashed password (bcrypt) |
| `remember_token` | varchar(100) | Session remember token |

### user_progress

Learning progress per user per language.

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint PK | Auto-increment ID |
| `user_id` | bigint FK → users.id | User reference |
| `language` | varchar(255) | Language name |
| `completed_topics` | JSON | Array of completed topic IDs: `["core-1-1", "core-1-2"]` |
| `selected_path_id` | varchar(255) | Currently selected specialization path |

### personal_access_tokens

Laravel Sanctum API tokens.

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint PK | Auto-increment ID |
| `tokenable_type` | varchar(255) | Polymorphic type (App\Models\User) |
| `tokenable_id` | bigint | User ID |
| `name` | text | Token name |
| `token` | varchar(64) UNIQUE | Hashed token |
| `abilities` | text | Token permissions |
| `last_used_at` | timestamp | Last API call timestamp |
| `expires_at` | timestamp | Token expiration |

## Indexes

| Table | Column(s) | Type |
|-------|-----------|------|
| `languages` | `id` | Primary |
| `roadmaps` | `language` | Unique |
| `roadmap_paths` | `(language, path_id)` | Index |
| `users` | `email` | Unique |
| `user_progress` | `user_id` | Index |
| `personal_access_tokens` | `token` | Unique |
