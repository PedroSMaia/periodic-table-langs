import { useRef, useState, useEffect } from "react";

/**
 * Horizontal filter bar for selecting a language category (or "All").
 *
 * Features:
 * - Scrollable pill buttons for each category
 * - Fade gradients on left/right edges when content overflows
 * - Arrow buttons (desktop only) to scroll the bar programmatically
 * - TIOBE rank legend shown in popularity mode (desktop only)
 *
 * Props:
 * @param {string|null} filter       - Currently active category key, or null for "all"
 * @param {function}    setFilter    - Setter to change the active filter
 * @param {string}      mode         - Current view mode ("normal" | "popularity" | "compare")
 * @param {boolean}     isDesktop    - Whether the viewport is desktop-sized
 * @param {number}      FILTER_BAR_H - Height of the bar in px
 * @param {Array}       FILTER_LIST  - Array of filter objects: { key, label, color, bg, count }
 * @param {object}      T            - Theme tokens
 */
export default function FilterBar({ filter, setFilter, mode, isDesktop, FILTER_BAR_H, FILTER_LIST, T }) {
    const th = T || { bg: "#0B0F19", border: "#1F2937" };

    // Ref to the scrollable container so we can read/set scrollLeft
    const scrollRef = useRef(null);

    // Track whether the user can scroll left or right (used to show/hide arrows and fades)
    const [canLeft,  setCanLeft]  = useState(false);
    const [canRight, setCanRight] = useState(true);

    // Re-check scroll position whenever the container scrolls
    const checkScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanLeft(el.scrollLeft > 4);
        setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    };

    // Run once on mount to set initial arrow visibility
    useEffect(() => { checkScroll(); }, []);

    // Scroll the bar left or right by a fixed amount
    const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 140, behavior: "smooth" });

    // Style for the fade gradient overlay on each edge
    const fade = (side) => ({
        position: "absolute", top: 0, bottom: 0, width: "32px",
        background: side === "left"
            ? "linear-gradient(to right, " + th.bg + " 50%, transparent)"
            : "linear-gradient(to left, "  + th.bg + " 50%, transparent)",
        [side]: 0, zIndex: 2, pointerEvents: "none",
    });

    // Style for the scroll arrow buttons
    const arrowBtn = (side, visible) => ({
        position: "absolute", top: 0, bottom: 0, width: "22px",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "transparent", border: "none", cursor: "pointer",
        color: th.sub, fontSize: "14px", zIndex: 3,
        [side]: 2,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity .15s",
    });

    return (
        <div style={{ position: "relative", flexShrink: 0, borderBottom: "1px solid " + th.border }}>

            {/* Edge fade overlays — only shown when there is content to scroll to */}
            {canLeft  && <div style={fade("left")} />}
            {canRight && <div style={fade("right")} />}

            {/* Arrow buttons — desktop only */}
            {isDesktop && <button style={arrowBtn("left",  canLeft)}  onClick={() => scroll(-1)}>‹</button>}
            {isDesktop && <button style={arrowBtn("right", canRight)} onClick={() => scroll(1)}>›</button>}

            {/* Scrollable pill list */}
            <div
                ref={scrollRef}
                className="no-scrollbar"
                onScroll={checkScroll}
                style={{
                    height: FILTER_BAR_H + "px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "1px", padding: "0 6px",
                    overflowX: "auto", overflowY: "hidden",
                }}
            >
                {FILTER_LIST.map(f => {
                    const active = f.key === "all" ? filter === null : filter === f.key;
                    return (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key === "all" ? null : (filter === f.key ? null : f.key))}
                            style={{
                                display: "flex", alignItems: "center", gap: "3px",
                                padding: "2px 8px", flexShrink: 0,
                                borderRadius: "4px", cursor: "pointer",
                                fontFamily: "'Plus Jakarta Sans',sans-serif",
                                fontWeight: active ? 700 : 500,
                                fontSize: "10px", letterSpacing: "0.03em",
                                border: "none",
                                background: active ? f.bg : "transparent",
                                color: active ? f.color : th.sub,
                                transition: "all .13s",
                            }}
                            onMouseEnter={e => { if (!active) { e.currentTarget.style.color = f.color; e.currentTarget.style.background = f.bg; } }}
                            onMouseLeave={e => { if (!active) { e.currentTarget.style.color = th.sub; e.currentTarget.style.background = "transparent"; } }}
                        >
                            {/* Category color dot */}
                            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: f.color, flexShrink: 0, opacity: active ? 1 : 0.5 }} />
                            {f.label}
                            {/* Language count badge */}
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "8px", opacity: active ? 0.7 : 0.35, marginLeft: "1px" }}>{f.count}</span>
                        </button>
                    );
                })}

                {/* TIOBE rank legend — only shown in popularity mode on desktop */}
                {mode === "popularity" && isDesktop && <>
                    <div style={{ width: "1px", height: "14px", background: th.border, margin: "0 6px", flexShrink: 0 }} />
                    <span style={{ fontSize: "11px", color: "#fbbf24", fontFamily: "'JetBrains Mono',monospace", whiteSpace: "nowrap" }}>🥇 Top 5</span>
                    <span style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "'JetBrains Mono',monospace", marginLeft: "6px", whiteSpace: "nowrap" }}>🥈 Top 20</span>
                    <span style={{ fontSize: "11px", color: "#cd7f32", fontFamily: "'JetBrains Mono',monospace", marginLeft: "6px", whiteSpace: "nowrap" }}>🥉 Top 50</span>
                </>}
            </div>
        </div>
    );
}