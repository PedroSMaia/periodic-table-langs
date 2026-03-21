# API Documentation

Base URL: `/api`

All endpoints return JSON. For endpoints requiring authentication, include the `Authorization: Bearer <token>` header and `Accept: application/json`.

---

## Public Endpoints

### GET /api/languages

Returns all 120 programming languages with their details.

**Response** `200 OK`

```json
[
  {
    "id": 1,
    "sym": "Py",
    "name": "Python",
    "cat": "scripting",
    "year": 1991,
    "paradigm": "Multi-paradigm · General",
    "desc": "The world's most popular language...",
    "links": {
      "docs": "https://docs.python.org/3/",
      "wiki": "https://en.wikipedia.org/wiki/Python_(programming_language)",
      "github": "https://github.com/python/cpython",
      "reddit": "https://www.reddit.com/r/Python/",
      "playground": "https://www.python.org/shell/",
      "stackoverflow": "https://stackoverflow.com/questions/tagged/python"
    },
    "tutorials": [
      { "name": "Official Tutorial", "url": "https://docs.python.org/3/tutorial/" }
    ],
    "frameworks": [
      { "name": "Django", "url": "https://www.djangoproject.com/", "desc": "Full-stack web framework" }
    ],
    "tools": [
      { "name": "Ruff", "url": "https://docs.astral.sh/ruff/", "desc": "Extremely fast linter & formatter" }
    ],
    "packages": [
      { "name": "NumPy", "url": "https://numpy.org/", "desc": "Numerical computing" }
    ],
    "package_manager": { "name": "pip / PyPI", "url": "https://pypi.org/" }
  }
]
```

---

### GET /api/languages/{id}

Returns a single language by ID.

**Response** `200 OK` — same structure as above (single object)

**Response** `404 Not Found`

---

### GET /api/metrics

Returns TIOBE rankings and Stack Overflow survey data.

**Response** `200 OK`

```json
{
  "tiobe": { "Python": 1, "C": 2, "C++": 3 },
  "so_loved": { "Rust": 83.0, "Python": 66.0 },
  "so_used": { "JavaScript": 62.3, "Python": 51.0 },
  "ratings": { "Python": 79.1, "JavaScript": 76.2 },
  "meta": { "updated_at": "2026-03-21T16:30:00+00:00" }
}
```

---

### GET /api/roadmap/{language}

Returns the learning roadmap for a language, including core phases and specialization path stubs.

**Parameters**
- `language` — Language name (URL-encoded for special characters: `C%2B%2B`, `C%23`, `F%23`)

**Response** `200 OK`

```json
{
  "language": "Python",
  "status": "ready",
  "generated_at": "2026-03-21T17:55:59.000000Z",
  "core": [
    {
      "id": "core-1",
      "label": "Python Fundamentals",
      "description": "Core syntax, data types, and basic program structure.",
      "topics": [
        {
          "id": "core-1-1",
          "label": "Installation & REPL",
          "description": "Install Python and use the interactive interpreter...",
          "type": "required",
          "resources": [
            "https://docs.python.org/3/using/index.html",
            "https://realpython.com/installing-python/"
          ]
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
      "category_icon": "🌐",
      "status": "cached"
    }
  ]
}
```

**Topic types**: `required`, `optional`, `advanced`

**Path status**: `cached` (detail available), `not_cached` (generate with refresh endpoint)

---

### GET /api/roadmap/{language}/path/{pathId}

Returns detailed content for a specialization path.

**Response** `200 OK`

```json
{
  "language": "Python",
  "path_id": "path-django",
  "label": "Django",
  "icon": "🟢",
  "category": "Web Frameworks",
  "status": "ready",
  "phases": [
    {
      "id": "path-django-phase-1",
      "label": "Django Basics",
      "description": "Project setup, apps, and the request/response cycle.",
      "topics": [
        {
          "id": "path-django-phase-1-1",
          "label": "Project Setup",
          "description": "django-admin startproject, startapp, settings.py...",
          "type": "required",
          "resources": [
            "https://docs.djangoproject.com/en/5.0/intro/tutorial01/",
            "https://docs.djangoproject.com/en/5.0/intro/overview/"
          ]
        }
      ]
    }
  ]
}
```

---

## Authentication Endpoints

### POST /api/auth/register

Register a new user account.

**Request Body**

```json
{
  "name": "Pedro",
  "email": "pedro@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response** `201 Created`

```json
{
  "user": { "id": 1, "name": "Pedro", "email": "pedro@example.com" },
  "token": "1|abc123..."
}
```

---

### POST /api/auth/login

Authenticate and receive an API token.

**Request Body**

```json
{
  "email": "pedro@example.com",
  "password": "password123"
}
```

**Response** `200 OK`

```json
{
  "user": { "id": 1, "name": "Pedro", "email": "pedro@example.com" },
  "token": "2|xyz789..."
}
```

**Response** `422 Unprocessable Content` — invalid credentials

---

### POST /api/auth/logout

Revoke the current token. Requires authentication.

**Response** `200 OK`

---

### GET /api/auth/me

Returns the authenticated user. Requires authentication.

**Response** `200 OK`

```json
{
  "id": 1,
  "name": "Pedro",
  "email": "pedro@example.com"
}
```

---

## Authenticated Endpoints

These endpoints require `Authorization: Bearer <token>` header.

### GET /api/progress

Returns the authenticated user's learning progress for all languages.

**Response** `200 OK`

```json
[
  {
    "language": "Python",
    "completed_topics": ["core-1-1", "core-1-2", "core-1-3"],
    "selected_path_id": "path-django"
  }
]
```

---

### POST /api/progress

Save or update learning progress for a language.

**Request Body**

```json
{
  "language": "Python",
  "completed_topics": ["core-1-1", "core-1-2"],
  "selected_path_id": "path-django"
}
```

**Response** `200 OK`

---

## Admin Endpoints

These endpoints require the `X-Admin-Key` header matching the `ADMIN_API_KEY` environment variable.

### POST /api/roadmap/{language}/refresh

Queue roadmap generation for a language using the Claude API.

**Headers**
- `X-Admin-Key: your-admin-api-key`

**Response** `200 OK`

```json
{
  "message": "Roadmap generation queued",
  "language": "Python"
}
```

> **Note:** Requires `ANTHROPIC_API_KEY` to be configured. The roadmap is generated asynchronously via Horizon queue worker.
