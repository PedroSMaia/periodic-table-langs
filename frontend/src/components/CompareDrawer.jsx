import { useRef } from "react";
import { CATEGORIES } from "../data/index.js";
import { RATINGS, TIOBE } from "../data/metrics.js";

/**
 * Bottom drawer that appears when the user is in "compare" mode.
 *
 * Two states:
 * 1. Fewer than 2 languages selected — shows a prompt and any selected pills
 * 2. 2 or 3 languages selected — shows the full comparison grid/cards
 *
 * Two layouts:
 * - Wide (effectiveCols > 5): horizontal grid — label column + one column per language
 * - Narrow (effectiveCols <= 5): vertical stacked cards — one card per language
 *
 * Props:
 * @param {Array}    langs         - Array of language objects currently being compared (max 3)
 * @param {function} onRemove      - Called with lang.id to remove a language from the list
 * @param {function} onClear       - Clears all languages from the compare list
 * @param {boolean}  isMobile      - Whether the viewport is mobile-sized
 * @param {number}   effectiveCols - Number of visible grid columns (used for layout switching)
 * @param {object}   T             - Theme tokens
 * @param {function} onClose       - Called when the user swipes down or closes the drawer
 */
export default function CompareDrawer({ langs, onRemove, onClear, isMobile, effectiveCols, T, onClose }) {
    const th = T || { card: "#111827", border: "#1F2937", bg: "#0B0F19" };

    // Swipe-down-to-close gesture (mobile)
    const swipeStartY = useRef(null);
    const onTouchStart = (e) => { swipeStartY.current = e.touches[0].clientY; };
    const onTouchEnd   = (e) => {
        if (swipeStartY.current === null) return;
        if (e.changedTouches[0].clientY - swipeStartY.current > 60 && onClose) onClose();
        swipeStartY.current = null;
    };

    // The four metrics used for comparison
    const METRICS = [
        { label: "Performance", icon: "⚡", idx: 0 },
        { label: "Ease",        icon: "📚", idx: 1 },
        { label: "Job Market",  icon: "💼", idx: 2 },
        { label: "Ecosystem",   icon: "🌿", idx: 3 },
    ];

    // Switch to stacked card layout when the grid is narrow
    const isNarrow = effectiveCols <= 5;

    /**
     * Get a metric value for a language.
     * Uses curated RATINGS if available, otherwise estimates from the TIOBE rank.
     */
    const getVal = (lang, m) => {
        const r = RATINGS[lang.name];
        if (r) return r[m.idx];
        // Fallback: estimate from TIOBE rank (higher rank = higher base score)
        const rank = TIOBE[lang.name] || 80;
        const base = Math.max(2, Math.round(8 - (rank / 120) * 5));
        if (m.idx === 0) return base;
        if (m.idx === 1) return Math.min(10, Math.max(2, base + 1));
        if (m.idx === 2) return Math.min(10, Math.max(1, base - 1));
        return base;
    };

    // ── PROMPT STATE (fewer than 2 selected) ────────────────────
    if (langs.length < 2) return (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 60, background: th.card, backdropFilter: "blur(16px)", borderTop: "1px solid " + th.border, padding: "9px 20px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
      <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.78rem", color: th.sub }}>
        {langs.length === 0
            ? <>{isMobile ? "Tap" : "Click"} languages to compare <span style={{ color: th.dim, fontSize: "0.7rem" }}>(max. 3)</span></>
            : <>{langs[0].name} selected — add 1 or 2 more</>}
      </span>
            {/* Selected language pill — click to remove */}
            {langs.map(l => (
                <span
                    key={l.id}
                    onClick={() => onRemove(l.id)}
                    style={{ padding: "3px 11px", borderRadius: "99px", border: "1px solid " + CATEGORIES[l.cat].color, color: CATEGORIES[l.cat].color, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.71rem", fontWeight: 600, cursor: "pointer" }}
                >{l.name} ×</span>
            ))}
        </div>
    );

    // ── FULL COMPARE DRAWER ──────────────────────────────────────
    return (
        <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 60, background: "linear-gradient(0deg," + th.bg + "," + th.card + ")", backdropFilter: "blur(16px)", borderTop: "1px solid " + th.border, padding: isMobile ? "10px 14px 16px" : "14px 22px 18px", maxHeight: isNarrow ? "80vh" : "45vh", overflowY: "auto" }}
        >
            {/* Mobile drag handle */}
            {isMobile && (
                <div style={{ display: "flex", justifyContent: "center", paddingBottom: "8px", cursor: "pointer" }} onClick={onClose}>
                    <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: th.border }} />
                </div>
            )}

            {/* Header: title + selected pills + clear button */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.25rem", letterSpacing: "0.06em", color: th.text }}>Compare Languages</div>
                <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
                    {langs.map(l => (
                        <span
                            key={l.id}
                            onClick={() => onRemove(l.id)}
                            style={{ padding: "3px 11px", borderRadius: "99px", border: "1px solid " + CATEGORIES[l.cat].color, color: CATEGORIES[l.cat].color, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.68rem", fontWeight: 600, cursor: "pointer" }}
                        >{l.name} ×</span>
                    ))}
                    <button
                        onClick={onClear}
                        style={{ padding: "3px 9px", borderRadius: "99px", border: "1px solid " + th.border, background: "transparent", color: th.sub, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.68rem", cursor: "pointer" }}
                    >Clear</button>
                </div>
            </div>

            {isNarrow ? (
                // ── NARROW LAYOUT: stacked cards, one per language ──
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {langs.map(l => {
                        const cat = CATEGORIES[l.cat];
                        return (
                            <div key={l.id} style={{ border: "1px solid " + cat.color + "33", borderRadius: "9px", background: cat.bg, padding: "10px 12px" }}>

                                {/* Language header inside card */}
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", border: "1.5px solid " + cat.color, borderRadius: "6px", padding: "3px 10px", background: th.bg }}>
                                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.45rem", color: cat.color, fontWeight: 600 }}>{String(l.id).padStart(2, "0")}</span>
                                        <span style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.5rem", color: cat.color, lineHeight: 1 }}>{l.sym}</span>
                                    </div>
                                    <div>
                                        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: th.text }}>{l.name}</div>
                                        {l.year && <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.6rem", color: th.dim }}>since {l.year}</div>}
                                    </div>
                                </div>

                                {/* Metric bars in a 2-column grid */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                                    {METRICS.map(m => {
                                        const v    = getVal(l, m);
                                        const maxV = Math.max(...langs.map(ll => getVal(ll, m)));
                                        // "win" = this language has the highest value for this metric
                                        const win  = v === maxV && langs.length > 1;
                                        return (
                                            <div key={m.label} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                                                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.65rem", color: th.sub, display: "flex", alignItems: "center", gap: "3px" }}>
                                                    <span>{m.icon}</span>{m.label}
                                                </div>
                                                <div style={{ height: "4px", background: th.border, borderRadius: "2px", overflow: "hidden" }}>
                                                    <div style={{ height: "100%", width: (v * 10) + "%", background: win ? cat.color : cat.color + "55", borderRadius: "2px" }} />
                                                </div>
                                                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.58rem", color: win ? cat.color : th.dim, fontWeight: win ? 700 : 400 }}>{v}/10{win ? " ✓" : ""}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                // ── WIDE LAYOUT: grid with label column + one column per language ──
                <div style={{ display: "grid", gridTemplateColumns: "120px repeat(" + langs.length + ",1fr)", gap: "6px", alignItems: "center" }}>

                    {/* Empty top-left cell */}
                    <div />

                    {/* Language header columns */}
                    {langs.map(l => {
                        const cat = CATEGORIES[l.cat];
                        return (
                            <div key={l.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "7px", border: "1px solid " + cat.color + "33", borderRadius: "7px", background: cat.bg }}>
                                <span style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.6rem", color: cat.color, lineHeight: 1 }}>{l.sym}</span>
                                <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.68rem", color: th.text, marginTop: "2px", fontWeight: 600 }}>{l.name}</span>
                                {l.year && <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.58rem", color: th.dim }}>since {l.year}</span>}
                            </div>
                        );
                    })}

                    {/* One row per metric: label cell + value cells */}
                    {METRICS.map(m => {
                        const vals = langs.map(l => getVal(l, m));
                        const max  = Math.max(...vals);
                        return [
                            // Metric label cell
                            <div key={m.label + "l"} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.74rem", color: th.sub, display: "flex", alignItems: "center", gap: "5px" }}>
                                <span>{m.icon}</span>{m.label}
                            </div>,
                            // One value cell per language
                            ...langs.map((l, i) => {
                                const v   = vals[i];
                                const cat = CATEGORIES[l.cat];
                                const win = v === max && langs.length > 1;
                                return (
                                    <div key={l.id + m.label} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                                        <div style={{ height: "5px", background: th.border, borderRadius: "2px", overflow: "hidden" }}>
                                            <div style={{ height: "100%", width: (v * 10) + "%", background: win ? cat.color : cat.color + "55", borderRadius: "2px" }} />
                                        </div>
                                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.58rem", color: win ? cat.color : th.dim, fontWeight: win ? 700 : 400 }}>{v}/10{win ? " ✓" : ""}</span>
                                    </div>
                                );
                            }),
                        ];
                    })}
                </div>
            )}
        </div>
    );
}