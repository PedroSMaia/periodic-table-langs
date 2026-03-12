import { useState, useEffect, useRef } from "react";
import { CATEGORIES } from "../data/index.js";
import { TIOBE } from "../data/metrics.js";
import { useDebounce } from "../hooks/useDebounce.js";

// Languages shown as quick-select pills when the search input is empty
const POPULAR = ["Python", "JavaScript", "Rust", "Go", "TypeScript", "Haskell", "C", "Lua"];

/**
 * Full-screen search modal with keyboard navigation.
 *
 * Features:
 * - Auto-focuses the input on mount
 * - Filters by name, symbol, or category label
 * - Keyboard navigation: ArrowUp / ArrowDown to move, Enter to select, Escape to close
 * - Popular language pills shown when query is empty
 * - TIOBE rank badge on each result row
 *
 * Props:
 * @param {function} onClose  - Called to close the modal (Escape key or backdrop click)
 * @param {function} onSelect - Called with the selected language object
 * @param {object}   T        - Theme tokens
 */
export default function SearchModal({ onClose, onSelect, T, langs = [] }) {
    const [q, setQ]             = useState("");
    const [activeIdx, setActiveIdx] = useState(-1);

    const inputRef = useRef(null);
    const listRef  = useRef(null);

    const th = T || { card: "#111827", border: "#1F2937", bg: "#0B0F19", dim: "#6B7280", text: "#F9FAFB", sub: "#9CA3AF" };

    // Debounce the query so filtering doesn't run on every single keystroke
    const debouncedQ = useDebounce(q, 150);

    // Auto-focus the input when the modal opens
    useEffect(() => { inputRef.current?.focus(); }, []);

    // Reset keyboard selection whenever the query changes
    useEffect(() => { setActiveIdx(-1); }, [debouncedQ]);

    // Filter LANGS by name, symbol, or category label — cap at 9 results
    const results = debouncedQ.trim().length === 0 ? [] : LANGS.filter(l =>
        l.name.toLowerCase().includes(debouncedQ.toLowerCase()) ||
        l.sym.toLowerCase().includes(debouncedQ.toLowerCase())  ||
        CATEGORIES[l.cat]?.label.toLowerCase().includes(debouncedQ.toLowerCase())
    ).slice(0, 9);

    /**
     * Keyboard handler — attached to the modal wrapper so it catches all key events.
     * ArrowDown / ArrowUp move the active result, Enter selects it, Escape closes.
     */
    const handleKey = (e) => {
        if (e.key === "Escape") { onClose(); return; }
        if (results.length === 0) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIdx(i => Math.min(i + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIdx(i => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && activeIdx >= 0) {
            e.preventDefault();
            onSelect(results[activeIdx]);
            onClose();
        }
    };

    return (
        <div
            onKeyDown={handleKey}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(11,15,25,0.88)", backdropFilter: "blur(10px)", zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "70px" }}
        >
            {/* Modal card — stopPropagation prevents backdrop click from closing when clicking inside */}
            <div
                onClick={e => e.stopPropagation()}
                style={{ width: "100%", maxWidth: "520px", margin: "0 12px", background: th.card, border: "1px solid " + th.border, borderRadius: "14px", overflow: "hidden", boxShadow: "0 28px 80px rgba(0,0,0,0.7)" }}
            >
                {/* Search input row */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", borderBottom: "1px solid " + th.border }}>
                    <span style={{ color: "#6B7280", fontSize: "18px", lineHeight: 1 }}>⌕</span>
                    <input
                        ref={inputRef}
                        value={q}
                        onChange={e => setQ(e.target.value)}
                        placeholder="Search languages…"
                        style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: th.text, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "15px" }}
                    />
                    <kbd style={{ padding: "2px 7px", borderRadius: "5px", border: "1px solid " + th.border, background: th.card, color: th.dim, fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", whiteSpace: "nowrap" }}>ESC</kbd>
                    {/* Arrow key hint — only shown when there are results to navigate */}
                    {results.length > 0 && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", color: th.dim, whiteSpace: "nowrap" }}>↑↓ ↵</span>}
                </div>

                {/* Popular pills — shown when the input is empty */}
                {q.trim().length === 0 && (
                    <div style={{ padding: "10px 14px 12px" }}>
                        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.68rem", color: th.dim, marginBottom: "7px", letterSpacing: "0.05em" }}>POPULAR</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                            {POPULAR.map(name => {
                                const l = LANGS.find(x => x.name === name);
                                if (!l) return null;
                                const cat = CATEGORIES[l.cat];
                                return (
                                    <span
                                        key={l.id}
                                        onClick={() => { onSelect(l); onClose(); }}
                                        style={{ padding: "3px 10px", borderRadius: "99px", border: "1px solid " + cat.color + "44", color: cat.color, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.72rem", cursor: "pointer", background: cat.bg }}
                                    >{l.name}</span>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Results list */}
                {results.length > 0 && (
                    <div ref={listRef} style={{ maxHeight: "380px", overflowY: "auto" }}>
                        {results.map((l, idx) => {
                            const cat      = CATEGORIES[l.cat];
                            const isActive = idx === activeIdx;
                            return (
                                <div
                                    key={l.id}
                                    onClick={() => { onSelect(l); onClose(); }}
                                    onMouseEnter={e => { setActiveIdx(idx); e.currentTarget.style.background = th.border; }}
                                    onMouseLeave={e => { if (idx !== activeIdx) e.currentTarget.style.background = "transparent"; }}
                                    style={{ display: "flex", alignItems: "center", gap: "12px", padding: "9px 16px", cursor: "pointer", borderBottom: "1px solid " + th.border + "88", transition: "background .1s", background: isActive ? th.border : "transparent" }}
                                >
                                    {/* Mini language badge */}
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", border: "1.5px solid " + cat.color + (isActive ? "" : "88"), borderRadius: "5px", padding: "2px 8px", background: cat.bg, minWidth: "44px", flexShrink: 0 }}>
                                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.42rem", color: cat.color, fontWeight: 600 }}>{String(l.id).padStart(2, "0")}</span>
                                        <span style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.2rem", color: cat.color, lineHeight: 1 }}>{l.sym}</span>
                                    </div>

                                    {/* Language name + category */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: th.text }}>{l.name}</div>
                                        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.67rem", color: cat.color }}>{cat.label}{l.year ? " · since " + l.year : ""}</div>
                                    </div>

                                    {/* TIOBE rank badge */}
                                    {TIOBE[l.name] && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.6rem", color: "#fbbf24", whiteSpace: "nowrap" }}>#{TIOBE[l.name]}</span>}

                                    {/* Enter-to-select hint for the active row */}
                                    {isActive && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", color: th.dim, flexShrink: 0 }}>↵</span>}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* No results message */}
                {q.trim().length > 0 && results.length === 0 && (
                    <div style={{ padding: "24px", textAlign: "center", color: th.dim, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.85rem" }}>
                        No results for "{q}"
                    </div>
                )}
            </div>
        </div>
    );
}