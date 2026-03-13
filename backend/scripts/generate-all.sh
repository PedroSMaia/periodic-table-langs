#!/bin/bash

# ── Usage ─────────────────────────────────────────────────────────────────────
#
#   Run from: backend/
#
#   Roadmaps only:
#     ./scripts/generate-all.sh --tier1      # Python, C, C++, Java, C#
#     ./scripts/generate-all.sh --tier2      # JS, Go, SQL, PHP, TS, Rust, Kotlin, Swift, R, MATLAB, Ruby, Dart, Scala, Perl, Visual Basic
#     ./scripts/generate-all.sh --tier3      # Lua, Haskell, Elixir, Clojure, Julia, Groovy, PowerShell, Assembly, Bash, F#
#     ./scripts/generate-all.sh              # All tiers
#
#   Roadmaps + 5 paths each:
#     ./scripts/generate-all.sh --tier1 --paths
#     ./scripts/generate-all.sh --tier2 --paths
#     ./scripts/generate-all.sh --tier3 --paths
#     ./scripts/generate-all.sh --paths
#
#   Before running:
#     docker exec periodic-table-langs-redis-1 redis-cli FLUSHDB
#
# ─────────────────────────────────────────────────────────────────────────────

# Usage: ./scripts/generate-all.sh [--paths]
# Run from: backend/

ADMIN_KEY=$(grep ADMIN_API_KEY .env | cut -d= -f2)
BASE="http://localhost:8000/api"
GENERATE_PATHS=${1:-""}
MAX_PATHS=5

# ── Language tiers ────────────────────────────────────────────────────────────

TIER1=(
    "Python" "C" "C++" "Java" "C#"
)

TIER2=(
    "JavaScript" "Go" "Visual Basic" "SQL" "PHP"
    "TypeScript" "Rust" "Kotlin" "Swift" "R"
    "MATLAB" "Ruby" "Dart" "Scala" "Perl"
)

TIER3=(
    "Lua" "Haskell" "Elixir" "Clojure" "Julia"
    "Groovy" "PowerShell" "Assembly" "Bash" "F#"
)

# Select tier based on argument
case "${2:-all}" in
    --tier1) LANGS=("${TIER1[@]}") ;;
    --tier2) LANGS=("${TIER2[@]}") ;;
    --tier3) LANGS=("${TIER3[@]}") ;;
    *)       LANGS=("${TIER1[@]}" "${TIER2[@]}" "${TIER3[@]}") ;;
esac

# ── Helpers ───────────────────────────────────────────────────────────────────

urlencode() {
    python3 -c "import urllib.parse; print(urllib.parse.quote('$1'))"
}

get_status() {
    curl -s "$1" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('status','unknown'))" 2>/dev/null
}

wait_for_status() {
    local url=$1
    local label=$2
    while true; do
        STATUS=$(get_status "$url")
        echo "  [$label] status: $STATUS"
        if [ "$STATUS" = "ready" ]; then
            echo "  ✅ $label ready"
            return 0
        elif [ "$STATUS" = "failed" ]; then
            echo "  ❌ $label failed"
            return 1
        fi
        sleep 5
    done
}

generate_paths() {
    local lang=$1
    echo "  🔀 Fetching top $MAX_PATHS paths for $lang..."

    PATHS=$(curl -s "$BASE/roadmap/$(urlencode "$lang")" | python3 -c "
import sys, json
d = json.load(sys.stdin)
paths = d.get('paths', [])
not_cached = [p['id'] for p in paths if p.get('status') == 'not_cached']
for p in not_cached[:$MAX_PATHS]:
    print(p)
" 2>/dev/null)

    if [ -z "$PATHS" ]; then
        echo "  No paths to generate for $lang"
        return
    fi

    count=0
    while IFS= read -r path_id; do
        [ -z "$path_id" ] && continue
        count=$((count + 1))
        echo "  ▶ [$count/$MAX_PATHS] Generating path: $path_id"

        curl -s -X POST "$BASE/roadmap/$(urlencode "$lang")/path/$(urlencode "$path_id")/refresh" \
            -H "X-Admin-Key: $ADMIN_KEY" \
            -H "Content-Type: application/json" > /dev/null

        wait_for_status "$BASE/roadmap/$(urlencode "$lang")/path/$(urlencode "$path_id")" "$path_id"
    done <<< "$PATHS"
}

# ── Main ──────────────────────────────────────────────────────────────────────

echo "🚀 Starting generation for ${#LANGS[@]} languages..."
echo "   Tier: ${2:-all} | Paths: ${GENERATE_PATHS:-no}"
echo ""

for lang in "${LANGS[@]}"; do
    CURRENT=$(get_status "$BASE/roadmap/$(urlencode "$lang")")
    if [ "$CURRENT" = "ready" ]; then
        echo "⏭  [$lang] already ready — skipping roadmap"
        if [ "$GENERATE_PATHS" = "--paths" ]; then
            generate_paths "$lang"
        fi
        echo ""
        continue
    fi

    echo "▶ Requesting roadmap: $lang"
    curl -s -X POST "$BASE/roadmap/$(urlencode "$lang")/refresh" \
        -H "X-Admin-Key: $ADMIN_KEY" \
        -H "Content-Type: application/json" > /dev/null

    if wait_for_status "$BASE/roadmap/$(urlencode "$lang")" "$lang"; then
        if [ "$GENERATE_PATHS" = "--paths" ]; then
            generate_paths "$lang"
        fi
    fi

    echo ""
done

echo "🎉 All done!"
