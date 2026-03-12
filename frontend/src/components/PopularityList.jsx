import { CATEGORIES } from "../data/index.js";
import { TIOBE, SO_LOVED, SO_USED } from "../data/metrics.js";

/**
 * Sorted list of languages by TIOBE rank, used in the "popularity" view mode.
 * Languages without a TIOBE rank are pushed to the bottom.
 *
 * Each row shows:
 * - Tier medal or rank number (color-coded by tier)
 * - Mini language badge (id + symbol)
 * - Language name + category label
 * - Stack Overflow Loved % and Used % (when available)
 *
 * Props:
 * @param {string|null} filter - Active category key, or null to show all languages
 * @param {object}      T      - Theme tokens
 */
export default function PopularityList({ filter, T, langs = [] }) {
    const th = T || { card: "#111827", border: "#1F2937" };

    // Sort by TIOBE rank ascending; languages not in TIOBE get rank 999 (bottom)
    const sorted = LANGS
        .filter(l => !filter || l.cat === filter)
        .sort((a, b) => (TIOBE[a.name] || 999) - (TIOBE[b.name] || 999));

    // Color for the rank badge based on TIOBE tier
    const tierColor = (r) => !r || r > 50 ? "#6B7280" : r <= 5 ? "#fbbf24" : r <= 20 ? "#94a3b8" : "#cd7f32";

    // Medal emoji for top tiers, empty string for the rest (rank number shown instead)
    const tierLabel = (r) => !r ? "—" : r <= 5 ? "🥇" : r <= 20 ? "🥈" : r <= 50 ? "🥉" : "";

    return (
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px 80px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {sorted.map(l => {
                const cat  = CATEGORIES[l.cat];
                const rank = TIOBE[l.name];
                const lv   = SO_LOVED[l.name];
                const us   = SO_USED[l.name];

                return (
                    <div key={l.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "8px", border: "1px solid " + cat.color + "22", background: cat.bg }}>

                        {/* Rank badge: medal emoji for top tiers, "#N" for others, "—" if unranked */}
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.72rem", color: tierColor(rank), minWidth: "30px", textAlign: "center", fontWeight: 700 }}>
              {tierLabel(rank) || ("#" + (rank || "?"))}
            </span>

                        {/* Mini language badge */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", border: "1.5px solid " + cat.color, borderRadius: "5px", padding: "2px 6px", background: th.card, minWidth: "38px", flexShrink: 0 }}>
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.4rem", color: cat.color, fontWeight: 600 }}>{String(l.id).padStart(2, "0")}</span>
                            <span style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.1rem", color: cat.color, lineHeight: 1 }}>{l.sym}</span>
                        </div>

                        {/* Language name + category */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: "0.85rem", color: th.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.name}</div>
                            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.62rem", color: cat.color }}>{cat.label}</div>
                        </div>

                        {/* SO stats — only rendered when data exists */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "1px", alignItems: "flex-end" }}>
                            {lv != null && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.6rem", color: "#34d399", whiteSpace: "nowrap" }}>♥ {lv}%</span>}
                            {us != null && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.6rem", color: "#60a5fa", whiteSpace: "nowrap" }}>✦ {us}%</span>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}