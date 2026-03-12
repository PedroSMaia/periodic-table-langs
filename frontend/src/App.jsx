import { useState, useEffect, useRef } from "react";
import { CATEGORIES } from "./data/index.js";
import { useLanguages } from "./hooks/useLanguages.js";
import { getPos } from "./utils/grid.js";
import { COLS } from "./utils/constants.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";

import Cell          from "./components/Cell.jsx";
import FilterBar     from "./components/FilterBar.jsx";
import DetailPanel   from "./components/DetailPanel.jsx";
import CompareDrawer from "./components/CompareDrawer.jsx";
import SearchModal   from "./components/SearchModal.jsx";
import QuizModal     from "./components/QuizModal.jsx";
import PopularityList from "./components/PopularityList.jsx";

// ── Theme tokens ─────────────────────────────────────────────────────────────
// Two complete sets of design tokens — dark (default) and light.
// Passed as prop T to every component so nothing has hardcoded colors.
const DARK_THEME = {
    bg: "#0B0F19", card: "#111827", border: "#1F2937",
    text: "#F9FAFB", sub: "#9CA3AF", dim: "#6B7280",
    navBg: "rgba(11,15,25,0.92)", cellText: "rgba(255,255,255,0.82)",
    btnBorder: "rgba(255,255,255,0.08)", btnBorderActive: "rgba(255,255,255,0.28)",
    btnBg: "transparent", btnBgActive: "rgba(255,255,255,0.12)",
    btnColor: "rgba(255,255,255,0.45)", btnColorActive: "white",
    btnHoverBg: "rgba(255,255,255,0.07)", btnHoverColor: "rgba(255,255,255,0.8)",
    divider: "rgba(255,255,255,0.1)", kbdBorder: "rgba(255,255,255,0.15)",
    kbdBg: "rgba(255,255,255,0.06)",
};

const LIGHT_THEME = {
    bg: "#F0F2F5", card: "#FFFFFF", border: "#E5E7EB",
    text: "#1F2937", sub: "#374151", dim: "#6B7280",
    navBg: "rgba(240,242,245,0.97)", cellText: "#1F2937",
    btnBorder: "#E5E7EB", btnBorderActive: "#1F2937",
    btnBg: "transparent", btnBgActive: "rgba(31,41,55,0.08)",
    btnColor: "#6B7280", btnColorActive: "#1F2937",
    btnHoverBg: "rgba(31,41,55,0.05)", btnHoverColor: "#1F2937",
    divider: "#E5E7EB", kbdBorder: "#E5E7EB",
    kbdBg: "#F0F2F5",
};

// View mode definitions for the navbar buttons
const MODES = [
    { id: "table",      icon: "▦", label: "Table"      },
    { id: "compare",    icon: "⇄", label: "Compare"    },
    { id: "popularity", icon: "★", label: "Popularity" },
];

// Fixed layout heights
const NAVBAR_H     = 48;
const FILTER_BAR_H = 48;

export default function App() {
    // ── State ──────────────────────────────────────────────────────────────────
    const [selected,    setSelected]    = useState(null);   // Currently open DetailPanel lang
    const [filter,      setFilter]      = useState(null);   // Active category filter key
    const [mode,        setMode]        = useState("table");// "table" | "compare" | "popularity"
    const [compareList, setCompareList] = useState([]);     // Array of lang IDs in compare mode
    const [showQuiz,    setShowQuiz]    = useState(false);
    const [highlighted, setHighlighted] = useState([]);     // Lang IDs highlighted by quiz results
    const [showSearch,  setShowSearch]  = useState(false);
    const [dims,        setDims]        = useState({ w: window.innerWidth, h: window.innerHeight });

    // Dark mode persisted via localStorage so the preference survives page reloads
    const [darkMode, setDarkMode] = useLocalStorage("ptl-dark", true);

    // Languages fetched from the API
    const { langs: LANGS, loading: langsLoading, error: langsError } = useLanguages();

    // Keyboard-focused cell ID — managed via ref + state to avoid stale closures in keydown handler
    const [focusedId, setFocusedIdS] = useState(null);
    const focusedIdRef = useRef(null);
    const visLangsRef  = useRef([]);

    // Wrapper that keeps both ref and state in sync
    const setFocusedId = (v) => {
        const val = typeof v === "function" ? v(focusedIdRef.current) : v;
        focusedIdRef.current = val;
        setFocusedIdS(val);
    };

    const T = darkMode ? DARK_THEME : LIGHT_THEME;

    // ── Effects ────────────────────────────────────────────────────────────────

    // Track viewport size for responsive layout calculations
    useEffect(() => {
        const fn = () => setDims({ w: window.innerWidth, h: window.innerHeight });
        window.addEventListener("resize", fn);
        return () => window.removeEventListener("resize", fn);
    }, []);

    // Read URL params on mount to support deep linking (e.g. ?lang=Python&mode=compare)
    useEffect(() => {
        const p = new URLSearchParams(window.location.search);
        const urlMode   = p.get("mode");
        const urlFilter = p.get("filter");
        const langName  = p.get("lang");
        if (urlMode && ["table", "compare", "popularity"].includes(urlMode)) setMode(urlMode);
        if (urlFilter && Object.keys(CATEGORIES).includes(urlFilter)) setFilter(urlFilter);
        if (langName) {
            const l = LANGS.find(x => x.name.toLowerCase() === langName.toLowerCase());
            if (l) setSelected(l);
        }
    }, []);

    // Write URL params whenever relevant state changes (keeps URL shareable)
    useEffect(() => {
        const p = new URLSearchParams();
        if (mode !== "table") p.set("mode", mode);
        if (filter)           p.set("filter", filter);
        if (selected)         p.set("lang", selected.name);
        const str = p.toString();
        window.history.replaceState(null, "", str ? "?" + str : window.location.pathname);
    }, [selected, mode, filter]);

    // Cmd+K / Ctrl+K to toggle search modal
    useEffect(() => {
        const fn = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setShowSearch(v => !v);
            }
        };
        window.addEventListener("keydown", fn);
        return () => window.removeEventListener("keydown", fn);
    }, []);

    // ── Layout calculations ────────────────────────────────────────────────────
    const isMobile  = dims.w < 640;
    const isDesktop = dims.w >= 1100;

    // Scrollbar width only matters on non-desktop (desktop uses overflow: visible)
    const SCROLLBAR_W = isDesktop ? 0 : 17;
    const PAD = Math.max(4, Math.round(dims.h * 0.006));
    const GAP = Math.max(2, Math.round(Math.min(dims.w, dims.h) * 0.002));

    const gridW       = dims.w - PAD * 2 - SCROLLBAR_W;
    const totalHeaderH = NAVBAR_H + FILTER_BAR_H;
    const gridH       = dims.h - totalHeaderH - PAD * 2;

    const simpleLayout = isMobile;

    // On desktop: find the number of columns where cells achieve the target aspect ratio
    // while fitting entirely on screen without scroll.
    const TARGET_RATIO = 1.2;
    let effectiveCols;
    if (isDesktop) {
        const minCols = Math.max(3, Math.floor((gridW + GAP) / (130 + GAP)));
        let best = minCols;
        for (let n = minCols; n <= COLS + 6; n++) {
            const sw = Math.floor((gridW - GAP * (n - 1)) / n);
            if (sw < 60) break;
            const nFullRows = simpleLayout
                ? Math.ceil(LANGS.length / n)
                : Math.ceil(Math.max(0, LANGS.length - 6) / n);
            const nRows = simpleLayout ? nFullRows : 2 + nFullRows;
            const ch = Math.floor((gridH - GAP * (nRows - 1)) / nRows);
            best = n;
            if (ch / sw >= TARGET_RATIO) break;
        }
        effectiveCols = best;
    } else {
        effectiveCols = Math.min(COLS, Math.max(3, Math.floor((gridW + GAP) / (95 + GAP))));
    }

    const numFullRows  = simpleLayout
        ? Math.ceil(LANGS.length / effectiveCols)
        : Math.ceil(Math.max(0, LANGS.length - 6) / effectiveCols);
    const numRows = simpleLayout ? numFullRows : 2 + numFullRows;

    // Assign grid positions to each language.
    let visIdx = 0;
    const langsWithPos = LANGS.map((lang, i) => {
        const visible = !filter || lang.cat === filter;
        if (visible) {
            const [r, c] = getPos(visIdx++, effectiveCols, simpleLayout);
            return { ...lang, gridRow: r, gridCol: c, hidden: false };
        } else {
            const [r, c] = getPos(i, effectiveCols, simpleLayout);
            return { ...lang, gridRow: r, gridCol: c, hidden: true };
        }
    });

    const displayCount = filter ? LANGS.filter(l => l.cat === filter).length : LANGS.length;

    const slotW = Math.floor((gridW - GAP * (effectiveCols - 1)) / effectiveCols);
    const cellH = isDesktop
        ? Math.floor((gridH - GAP * (numRows - 1)) / numRows)
        : Math.round(slotW * 1.28);
    const scrollGridH = numRows * cellH + (numRows - 1) * GAP;

    const titleWidth = slotW * (effectiveCols - 2) + GAP * (effectiveCols - 3);

    const visLangs = langsWithPos.filter(l => !l.hidden);
    visLangsRef.current = visLangs;

    // ── Keyboard navigation ────────────────────────────────────────────────────
    useEffect(() => {
        const fn = (e) => {
            if (e.key === "Escape") {
                if (showSearch)             { setShowSearch(false);  return; }
                if (showQuiz)               { setShowQuiz(false);    return; }
                if (focusedIdRef.current)   { setFocusedId(null);    return; }
                if (selected)               { setSelected(null);     return; }
                return;
            }
            if (showSearch || showQuiz) return;
            if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Enter"].includes(e.key)) return;
            e.preventDefault();

            if (e.key === "Enter") {
                const fid = focusedIdRef.current;
                if (fid) {
                    const l = visLangsRef.current.find(x => x.id === fid);
                    if (l) { setSelected(l); setHighlighted([]); setFocusedId(null); }
                }
                return;
            }

            const vis = visLangsRef.current;
            if (!vis.length) return;
            const prev = focusedIdRef.current;
            const idx  = prev ? vis.findIndex(x => x.id === prev) : -1;
            let next   = idx;
            if      (e.key === "ArrowRight") next = idx < 0 ? 0 : Math.min(idx + 1, vis.length - 1);
            else if (e.key === "ArrowLeft")  next = Math.max(idx - 1, 0);
            else if (e.key === "ArrowDown")  next = idx < 0 ? effectiveCols : Math.min(idx + effectiveCols, vis.length - 1);
            else if (e.key === "ArrowUp")    next = Math.max(idx - effectiveCols, 0);
            if (next >= 0 && next < vis.length) setFocusedId(vis[next].id);
        };
        window.addEventListener("keydown", fn);
        return () => window.removeEventListener("keydown", fn);
    }, [showSearch, showQuiz, selected, effectiveCols]);

    // ── Filter bar data ────────────────────────────────────────────────────────
    const FILTER_LIST = [
        {
            key: "all", label: "All", count: LANGS.length,
            color: darkMode ? "rgba(255,255,255,0.75)" : "#374151",
            bg:    darkMode ? "rgba(255,255,255,0.08)" : "#E5E7EB",
        },
        ...Object.entries(CATEGORIES).map(([k, v]) => ({
            key:   k,
            label: v.label,
            count: LANGS.filter(l => l.cat === k).length,
            color: v.color,
            bg:    v.bg,
        })),
    ];

    // ── Handlers ──────────────────────────────────────────────────────────────

    const toggleCompare = (lang) => {
        setCompareList(prev => {
            if (prev.includes(lang.id)) return prev.filter(id => id !== lang.id);
            if (prev.length >= 3) return prev;
            return [...prev, lang.id];
        });
        setSelected(null);
    };

    const handleAddToCompare = (lang) => {
        setCompareList(prev => {
            if (prev.includes(lang.id)) return prev;
            if (prev.length >= 3) return prev;
            return [...prev, lang.id];
        });
        handleSetMode("compare");
        setSelected(null);
    };

    const handleSetMode = (m) => {
        setMode(m);
        if (m !== "compare") setCompareList([]);
        if (m !== "table")   setSelected(null);
    };

    const showPopList = mode === "popularity" && !isDesktop;

    // ── Loading / error states ─────────────────────────────────────────────────
    if (langsLoading) {
        return (
            <div style={{ width: "100vw", height: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "14px" }}>
                <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.8rem", letterSpacing: "0.08em", background: "linear-gradient(135deg,#FF7A00,#FFA94D)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    LOADING LANGUAGES…
                </div>
                <div style={{ width: "200px", height: "3px", background: T.border, borderRadius: "99px", overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "linear-gradient(90deg,#FF7A00,#FFA94D)", animation: "ptl-load 1.2s ease-in-out infinite", borderRadius: "99px" }} />
                </div>
                <style>{`@keyframes ptl-load { 0%{width:0%;margin-left:0} 50%{width:80%;margin-left:0} 100%{width:0%;margin-left:100%} }`}</style>
            </div>
        );
    }

    if (langsError) {
        return (
            <div style={{ width: "100vw", height: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}>
                <div style={{ fontSize: "2.5rem" }}>⚠️</div>
                <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.4rem", letterSpacing: "0.06em", color: "#f87171" }}>Failed to load languages</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.75rem", color: T.dim }}>{langsError}</div>
                <button onClick={() => window.location.reload()} style={{ marginTop: "8px", padding: "6px 18px", borderRadius: "8px", border: "1px solid #f87171", background: "transparent", color: "#f87171", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.8rem" }}>
                    Retry
                </button>
            </div>
        );
    }

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div style={{ width: "100vw", height: "100vh", background: T.bg, color: T.text, overflow: "hidden", display: "flex", flexDirection: "column", boxSizing: "border-box", position: "relative" }}>
            <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; overflow: hidden; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

            {/* ── Navbar ── */}
            <div style={{ height: NAVBAR_H + "px", flexShrink: 0, display: "flex", alignItems: "center", padding: "0 12px", gap: isMobile ? "4px" : "6px", background: T.navBg, backdropFilter: "blur(14px)", borderBottom: "1px solid " + T.border, position: "relative", zIndex: 42 }}>

                <div style={{ fontFamily: "'Bebas Neue',display", fontSize: isMobile ? "13px" : "15px", letterSpacing: isMobile ? "0.08em" : "0.1em", background: "linear-gradient(135deg,#FF7A00,#FFA94D)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", whiteSpace: "nowrap", marginRight: isMobile ? "4px" : "8px" }}>
                    {isMobile ? "PT" : "PERIODIC TABLE"}
                </div>

                {!isMobile && <div style={{ width: "1px", height: "20px", background: T.divider, marginRight: "4px" }} />}

                {MODES.map(m => {
                    const active = mode === m.id;
                    return (
                        <button key={m.id} onClick={() => handleSetMode(m.id)}
                                style={{ display: "flex", alignItems: "center", gap: isMobile ? "0" : "6px", padding: isMobile ? "6px 10px" : "5px 14px", borderRadius: "8px", border: "1px solid " + (active ? T.btnBorderActive : T.btnBorder), background: active ? T.btnBgActive : T.btnBg, color: active ? T.btnColorActive : T.btnColor, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: "12px", letterSpacing: "0.04em", transition: "all .15s", whiteSpace: "nowrap" }}
                                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = T.btnHoverBg; e.currentTarget.style.color = T.btnHoverColor; } }}
                                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = T.btnBg;      e.currentTarget.style.color = T.btnColor; } }}
                        >
                            <span style={{ fontSize: "13px" }}>{m.icon}</span>
                            {!isMobile && m.label}
                        </button>
                    );
                })}

                {!isMobile && <div style={{ width: "1px", height: "20px", background: T.divider, margin: "0 2px" }} />}

                <button
                    onClick={() => setShowQuiz(true)}
                    style={{ display: "flex", alignItems: "center", gap: "4px", padding: isMobile ? "6px 10px" : "5px 14px", borderRadius: "8px", border: "1px solid rgba(255,122,0,0.4)", background: "rgba(255,122,0,0.1)", color: "#FF7A00", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: "12px", letterSpacing: "0.04em", transition: "all .15s", whiteSpace: "nowrap" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,122,0,0.2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,122,0,0.1)"}
                ><span>?</span>{!isMobile && " Quiz"}</button>

                {highlighted.length > 0 && (
                    <button
                        onClick={() => setHighlighted([])}
                        style={{ padding: "5px 10px", borderRadius: "8px", border: "1px solid rgba(167,139,250,0.35)", background: "rgba(167,139,250,0.1)", color: "#c084fc", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: "12px", whiteSpace: "nowrap" }}
                    >{isMobile ? "✕" : "Clear quiz ×"}</button>
                )}

                <div style={{ flex: 1 }} />

                <button
                    onClick={() => setShowSearch(true)}
                    style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "8px", border: "1px solid " + T.btnBorder, background: T.btnBg, color: T.btnColor, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "12px", transition: "all .15s", whiteSpace: "nowrap" }}
                    onMouseEnter={e => { e.currentTarget.style.background = T.btnHoverBg; e.currentTarget.style.color = T.btnHoverColor; }}
                    onMouseLeave={e => { e.currentTarget.style.background = T.btnBg;      e.currentTarget.style.color = T.btnColor; }}
                >
                    <span style={{ fontSize: "14px" }}>⌕</span>
                    {!isMobile && <kbd style={{ padding: "1px 5px", borderRadius: "3px", border: "1px solid " + T.kbdBorder, background: T.kbdBg, fontSize: "10px", fontFamily: "'JetBrains Mono',monospace", color: T.dim }}>⌘K</kbd>}
                </button>

                <button
                    onClick={() => setDarkMode(v => !v)}
                    title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    style={{ padding: "5px 8px", borderRadius: "8px", border: "1px solid " + T.btnBorder, background: T.btnBg, color: T.btnColor, cursor: "pointer", fontSize: "14px", transition: "all .15s", lineHeight: 1 }}
                    onMouseEnter={e => { e.currentTarget.style.background = T.btnHoverBg; e.currentTarget.style.color = T.btnHoverColor; }}
                    onMouseLeave={e => { e.currentTarget.style.background = T.btnBg;      e.currentTarget.style.color = T.btnColor; }}
                >{darkMode ? "☀" : "🌙"}</button>

                {mode === "popularity" && isMobile && <>
                    <span style={{ fontSize: "10px", color: "#fbbf24", fontFamily: "'JetBrains Mono',monospace" }}>🥇5</span>
                    <span style={{ fontSize: "10px", color: "#94a3b8", fontFamily: "'JetBrains Mono',monospace" }}>🥈20</span>
                    <span style={{ fontSize: "10px", color: "#cd7f32", fontFamily: "'JetBrains Mono',monospace" }}>🥉50</span>
                </>}
            </div>

            {/* ── Filter bar ── */}
            <div style={{ position: "relative", zIndex: 41 }}>
                <div style={{ pointerEvents: selected ? "none" : "auto", opacity: selected ? 0.4 : 1, transition: "opacity 0.2s" }}>
                    <FilterBar filter={filter} setFilter={setFilter} mode={mode} isDesktop={isDesktop} FILTER_BAR_H={FILTER_BAR_H} FILTER_LIST={FILTER_LIST} T={T} />
                </div>
            </div>

            {/* ── Popularity list (mobile / tablet) ── */}
            {showPopList && <PopularityList filter={filter} T={T} langs={LANGS} />}

            {/* ── Grid area ── */}
            {!showPopList && (
                <div style={{ flex: 1, overflowY: isDesktop ? "hidden" : "auto", overflowX: "hidden", position: "relative" }}>

                    {displayCount === 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "10px", paddingBottom: "60px" }}>
                            <div style={{ fontSize: "2.5rem" }}>🔭</div>
                            <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.4rem", letterSpacing: "0.06em", color: T.sub }}>No languages found</div>
                            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.8rem", color: T.dim }}>Try a different filter</div>
                            <button onClick={() => setFilter(null)} style={{ marginTop: "4px", padding: "5px 16px", borderRadius: "99px", border: "1px solid " + T.border, background: "transparent", color: T.sub, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.75rem", cursor: "pointer" }}>Clear filter</button>
                        </div>
                    ) : (
                        <div style={{
                            position: "relative",
                            top: PAD + "px", left: PAD + "px",
                            width: gridW + "px",
                            height: isDesktop ? gridH + "px" : scrollGridH + "px",
                            flexShrink: 0,
                            display: "grid",
                            gridTemplateColumns: "repeat(" + effectiveCols + "," + slotW + "px)",
                            gridTemplateRows: "repeat(" + numRows + "," + cellH + "px)",
                            gap: GAP + "px",
                            overflow: "visible",
                            marginBottom: isDesktop ? "0" : (PAD * 2 + 80) + "px",
                        }}>

                            {langsWithPos.map(lang => (
                                <Cell key={lang.id} lang={lang}
                                      gridRow={lang.gridRow} gridCol={lang.gridCol}
                                      animDelay={Math.min((lang.gridRow * effectiveCols + lang.gridCol) * 8, 400)}
                                      onClick={l => { setSelected(l); setHighlighted([]); setFocusedId(null); }}
                                      active={selected?.id === lang.id}
                                      mode={mode}
                                      inCompare={compareList.includes(lang.id)}
                                      onCompare={toggleCompare}
                                      highlighted={highlighted.includes(lang.id)}
                                      showPop={mode === "popularity"}
                                      cardW={slotW} cellH={cellH}
                                      hidden={lang.hidden}
                                      keyFocused={focusedId === lang.id}
                                      T={T}
                                      isDesktop={isDesktop}
                                />
                            ))}

                            {!simpleLayout && effectiveCols >= 7 && titleWidth >= 300 && (() => {
                                const maxFsByWidth = titleWidth / 13;
                                const fs    = Math.min(Math.max(12, cellH * 0.48), maxFsByWidth);
                                const subFs = Math.max(5, fs * 0.30);
                                const tagFs = Math.max(4, fs * 0.20);
                                return (
                                    <div style={{ position: "absolute", top: "0", left: (slotW + GAP) + "px", width: titleWidth + "px", height: cellH + "px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none", overflow: "visible" }}>
                                        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 300, fontSize: subFs + "px", letterSpacing: "0.1em", color: T.sub, textTransform: "uppercase", lineHeight: 1, whiteSpace: "nowrap", marginTop: "8px" }}>Periodic Table of</div>
                                        <div style={{ fontFamily: "'Bebas Neue',display", fontSize: fs + "px", letterSpacing: "0.04em", lineHeight: 1.1, background: "linear-gradient(135deg,#FF7A00 0%,#FFA94D 60%,#FF7A00 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", whiteSpace: "nowrap" }}>Programming Languages</div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {mode === "compare" && (
                        <CompareDrawer
                            langs={compareList.map(id => LANGS.find(l => l.id === id)).filter(Boolean)}
                            onRemove={id => setCompareList(p => p.filter(x => x !== id))}
                            onClear={() => setCompareList([])}
                            isMobile={isMobile}
                            effectiveCols={effectiveCols}
                            T={T}
                            onClose={() => setMode("table")}
                        />
                    )}
                </div>
            )}

            {selected && mode !== "compare" && (
                <DetailPanel
                    lang={selected}
                    onClose={() => setSelected(null)}
                    isMobile={isMobile}
                    onAddToCompare={handleAddToCompare}
                    inCompare={compareList.includes(selected.id)}
                    canCompare={compareList.length < 3 && !compareList.includes(selected.id)}
                    T={T}
                />
            )}

            {showQuiz && (
                <QuizModal
                    onClose={() => setShowQuiz(false)}
                    onHighlight={ids => { setHighlighted(ids); setMode("table"); setFilter(null); }}
                    T={T}
                    langs={LANGS}
                />
            )}

            {showSearch && (
                <SearchModal
                    T={T}
                    onClose={() => setShowSearch(false)}
                    onSelect={l => { setSelected(l); setMode("table"); setHighlighted([]); }}
                    langs={LANGS}
                />
            )}

            {focusedId && !showSearch && (
                <div style={{ position: "fixed", bottom: "12px", left: "50%", transform: "translateX(-50%)", background: T.card, border: "1px solid " + T.border, borderRadius: "8px", padding: "5px 12px", display: "flex", gap: "8px", alignItems: "center", zIndex: 35, pointerEvents: "none", backdropFilter: "blur(8px)" }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: T.sub }}>↑↓←→ navigate</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "#FF7A00" }}>↵ open</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: T.dim }}>ESC clear</span>
                </div>
            )}
        </div>
    );
}