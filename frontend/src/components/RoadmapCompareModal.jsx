import { useState, useEffect, useCallback } from "react";
import { CATEGORIES } from "../data/index.js";

/**
 * Self-contained roadmap comparison modal.
 * Handles language picking, roadmap fetching, and path selection internally.
 * items: [{ id, lang, type, pathId, pathLabel, pathIcon, phases, color }]
 */
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";
const _generating = new Set(); // module-level: survives StrictMode remounts

async function apiFetchRoadmap(langName) {
    const res = await fetch(`${API_BASE}/roadmap/${encodeURIComponent(langName)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    // The API returns { data: { core, paths, ... } } — unwrap if needed
    return json.data ?? json;
}

async function apiFetchPath(langName, pathId) {
    const res = await fetch(`${API_BASE}/roadmap/${encodeURIComponent(langName)}/path/${encodeURIComponent(pathId)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data ?? json;
}

async function apiGenerateRoadmap(langName) {
    const res = await fetch(`${API_BASE}/roadmap/${langName}/refresh`, { method: "POST" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export default function RoadmapCompareModal({ items, onItemsChange, onClose, T, langs = [] }) {
    const th = T || { bg: "#0B0F19", card: "#111827", border: "#1F2937", text: "#F9FAFB", sub: "#9CA3AF", dim: "#6B7280" };

    // ── Picker state ──────────────────────────────────────────────────────────
    // which slot is being filled (0 or 1), null = no picker open
    const [pickingSlot,    setPickingSlot]    = useState(null);
    const [pickerSearch,   setPickerSearch]   = useState("");
    const [pickerLang,     setPickerLang]     = useState(null);
    const [pickerGenerating, setPickerGenerating] = useState(false);
    const [pickerRoadmap,    setPickerRoadmap]    = useState(null);
    const [pickerLoading,    setPickerLoading]    = useState(false);
    const [pickerPathId,     setPickerPathId]     = useState(null);
    const [pickerError,      setPickerError]      = useState(null);

    const a = items[0] ?? null;
    const b = items[1] ?? null;

    // ── Overlap calculation ───────────────────────────────────────────────────
    const normalizeLabel = (label) => label
        .toLowerCase()
        .replace(/\b(in|with|for|using|via)\s+(laravel|symfony|django|rails|spring|express|gin|echo|fastapi|flask|nestjs|nuxt|next\.?js?|react|vue|angular)\b/gi, "")
        .replace(/\b(laravel|symfony|django|rails|spring|express|gin|echo|fastapi|flask|nestjs)\b/gi, "")
        .replace(/[&,]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const topicLabels = (item) =>
        new Set((item?.phases ?? []).flatMap(p => (p.topics ?? []).map(t => normalizeLabel(t.label))));

    const labelsA = topicLabels(a);
    const labelsB = topicLabels(b);
    const shared  = new Set([...labelsA].filter(l => labelsB.has(l)));
    const totalA  = labelsA.size;
    const totalB  = labelsB.size;

    // ── Open picker for a slot ────────────────────────────────────────────────
    const openPicker = (slot) => {
        setPickingSlot(slot);
        setPickerSearch("");
        setPickerLang(null);
        setPickerRoadmap(null);
        setPickerLoading(false);
        setPickerPathId(null);
        setPickerError(null);
    };

    const closePicker = () => {
        if (pickerLang) _generating.delete(pickerLang.name);
        setPickingSlot(null);
        setPickerLang(null);
        setPickerRoadmap(null);
        setPickerLoading(false);
        setPickerPathId(null);
        setPickerGenerating(false);
        setPickerError(null);
    };

    // ── Step 2: user chose a language, fetch roadmap ──────────────────────────
    const handlePickLang = useCallback(async (lang) => {
        setPickerLang(lang);
        setPickerLoading(true);
        setPickerGenerating(false);
        setPickerRoadmap(null);
        setPickerPathId(null);
        try {
            const rm = await apiFetchRoadmap(lang.name);
            const hasContent = (rm.core?.length ?? 0) > 0;
            if (!hasContent) {
                if (_generating.has(lang.name)) return; // already in progress
                _generating.add(lang.name);
                setPickerGenerating(true);
                setPickerLoading(false);
                try { await apiGenerateRoadmap(lang.name); } catch { /* already queued is fine */ }
                const poll = async () => {
                    try {
                        const updated = await apiFetchRoadmap(lang.name);
                        if ((updated.core?.length ?? 0) > 0) {
                            _generating.delete(lang.name);
                            setPickerRoadmap(updated);
                            setPickerGenerating(false);
                        } else {
                            setTimeout(poll, 4000);
                        }
                    } catch { setTimeout(poll, 4000); }
                };
                setTimeout(poll, 4000);
            } else {
                setPickerRoadmap(rm);
                setPickerLoading(false);
            }
        } catch (e) {
            setPickerLoading(false);
            setPickerError(`The ${lang.name} roadmap hasn't been generated yet.`);
        }
    }, []);

    // ── Step 3: user chose a path (or core), add to items ───────────────────
    const handleConfirm = useCallback(async (pathId, slot = pickingSlot) => {
        if (!pickerLang || !pickerRoadmap) return;
        const cat        = CATEGORIES[pickerLang.cat];
        const color      = cat?.color ?? "#FF7A00";
        let selectedPath = (pickerRoadmap.paths ?? []).find(p => p.id === pathId);

        // If path exists but has no phases, fetch them (read-only, no_generate)
        if (pathId && selectedPath && !selectedPath.phases?.length) {
            setPickerLoading(true);
            try {
                const pathData = await apiFetchPath(pickerLang.name, pathId);
                if (pathData.phases?.length) {
                    selectedPath = pathData;
                } else {
                    // Path not generated yet — fall back to null so UI shows warning
                    selectedPath = null;
                }
            } catch (e) {
                // 404 = not_cached, not an error — just no data yet
                selectedPath = null;
            } finally {
                setPickerLoading(false);
            }
        }

        if (pathId && !selectedPath) {
            setPickerLoading(false);
            setPickerError(`"${pathId}" hasn't been generated yet. Open it from the main table first.`);
            return;
        }

        const phases = pathId ? (selectedPath?.phases ?? []) : (pickerRoadmap.core ?? []);

        const item = {
            id:        pathId ? `${pickerLang.name}::${pathId}` : `${pickerLang.name}::core`,
            lang:      pickerLang,
            type:      pathId ? "path" : "core",
            pathId:    pathId ?? null,
            pathLabel: selectedPath?.label ?? null,
            pathIcon:  selectedPath?.icon  ?? null,
            phases,
            color,
        };

        // Use functional update to avoid stale closure on `items`
        onItemsChange(prev => {
            const next = [...prev];
            next[slot] = item;
            return next.filter(Boolean).slice(0, 2);
        });
        closePicker();
    }, [pickerLang, pickerRoadmap, onItemsChange]);

    // ── Auto-fetch path detail if needed ─────────────────────────────────────
    const handlePickPath = useCallback(async (pathId) => {
        if (!pickerLang || !pickerRoadmap || !pathId) { handleConfirm(pathId); return; }
        const path = (pickerRoadmap.paths ?? []).find(p => p.id === pathId);
        if (path?.phases) { handleConfirm(pathId); return; }
        // Need to fetch path detail
        setPickerLoading(true);
        try {
            await apiFetchPath(pickerLang.name, pathId);
            // fetchPath updates the roadmap in the parent hook — re-fetch
            const rm = await apiFetchRoadmap(pickerLang.name);
            setPickerRoadmap(rm);
        } finally {
            setPickerLoading(false);
        }
        handleConfirm(pathId);
    }, [pickerLang, pickerRoadmap, handleConfirm]);

    // ── Filtered langs for picker ─────────────────────────────────────────────
    const otherItem = pickingSlot === 0 ? b : a;
    const currentItem = pickingSlot === 0 ? a : b;
    const filteredLangs = langs.filter(l =>
        l.name.toLowerCase().includes(pickerSearch.toLowerCase())
    );

    // ── Path categories for picker ────────────────────────────────────────────
    const pathCategories = (() => {
        if (!pickerRoadmap?.paths?.length) return [];
        const catMap = {};
        pickerRoadmap.paths.forEach(p => {
            const k = p.category || "Other";
            if (!catMap[k]) catMap[k] = { label: k, icon: p.category_icon || p.icon, paths: [] };
            catMap[k].paths.push(p);
        });
        return Object.values(catMap);
    })();
    const [pickerCat, setPickerCat] = useState(null);
    const skipCat = pathCategories.length <= 1;

    // Reset cat when roadmap changes
    useEffect(() => {
        setPickerCat(skipCat ? (pathCategories[0]?.label ?? null) : null);
    }, [pickerRoadmap]);

    // ── Item header card ──────────────────────────────────────────────────────
    const ItemHeader = ({ item, slot }) => {
        if (!item) return (
            <div onClick={() => openPicker(slot)}
                 style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed " + th.border, borderRadius: "10px", padding: "20px", minHeight: "80px", cursor: "pointer", transition: "all .15s" }}
                 onMouseEnter={e => { e.currentTarget.style.borderColor = "#60a5fa66"; e.currentTarget.style.background = "rgba(96,165,250,0.05)"; }}
                 onMouseLeave={e => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.background = "transparent"; }}
            >
                <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.8rem", color: th.dim }}>+ Add roadmap to compare</span>
            </div>
        );
        const cat   = CATEGORIES[item.lang.cat];
        const color = cat?.color ?? "#FF7A00";
        return (
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", border: "1px solid " + color + "44", borderRadius: "10px", background: color + "0C", position: "relative" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", border: "1.5px solid " + color, borderRadius: "7px", padding: "4px 12px", background: th.bg }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.45rem", color, fontWeight: 600 }}>{String(item.lang.id).padStart(2, "0")}</span>
                    <span style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.8rem", color, lineHeight: 1 }}>{item.lang.sym}</span>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: "1rem", color: th.text }}>{item.lang.name}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.62rem", color, marginTop: "3px" }}>
                        {item.type === "core" ? "⬡ Core roadmap" : `${item.pathIcon ?? ""} ${item.pathLabel ?? "Path"}`}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.58rem", color: th.dim, marginTop: "2px" }}>
                        {item.phases?.length ?? 0} phases · {slot === 0 ? totalA : totalB} topics
                    </div>
                </div>
                <div style={{ display: "flex", gap: "6px", position: "absolute", top: "8px", right: "8px" }}>
                    <button onClick={() => openPicker(slot)} title="Change"
                            style={{ padding: "3px 8px", borderRadius: "5px", border: "1px solid " + th.border, background: "transparent", color: th.dim, cursor: "pointer", fontSize: "0.6rem", fontFamily: "'JetBrains Mono',monospace" }}>
                        change
                    </button>
                    <button onClick={() => onItemsChange(items.filter((_, i) => i !== slot))}
                            style={{ width: "20px", height: "20px", borderRadius: "50%", border: "1px solid " + th.border, background: "transparent", color: th.dim, cursor: "pointer", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </div>
            </div>
        );
    };

    // ── Phase column ──────────────────────────────────────────────────────────
    const PhaseColumn = ({ item, otherLabels }) => {
        if (!item) return <div style={{ flex: 1 }} />;
        const cat   = CATEGORIES[item.lang.cat];
        const color = cat?.color ?? "#FF7A00";
        return (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                {(item.phases ?? []).map(phase => (
                    <div key={phase.id}>
                        <div style={{ padding: "6px 12px", borderRadius: "7px 7px 0 0", background: color + "18", border: "1px solid " + color + "44", borderBottom: "none" }}>
                            <span style={{ fontFamily: "'Bebas Neue',display", fontSize: "0.85rem", letterSpacing: "0.07em", color }}>{phase.label}</span>
                        </div>
                        <div style={{ border: "1px solid " + color + "22", borderRadius: "0 0 7px 7px", overflow: "hidden" }}>
                            {(phase.topics ?? []).map((topic, i) => {
                                const isShared = otherLabels.has(topic.label.toLowerCase().trim());
                                return (
                                    <div key={topic.id} style={{ padding: "7px 12px", borderTop: i === 0 ? "none" : "1px solid " + th.border, background: isShared ? color + "0F" : th.card, display: "flex", alignItems: "center", gap: "8px" }}>
                                        {isShared
                                            ? <span style={{ fontSize: "0.6rem", color, flexShrink: 0 }}>⇄</span>
                                            : <span style={{ fontSize: "0.55rem", color: th.dim, flexShrink: 0 }}>·</span>}
                                        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.72rem", color: isShared ? th.text : th.sub, fontWeight: isShared ? 600 : 400, lineHeight: 1.3 }}>
                                            {topic.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // ── Picker overlay ────────────────────────────────────────────────────────
    const PickerOverlay = () => {
        const color = pickerLang ? (CATEGORIES[pickerLang.cat]?.color ?? "#FF7A00") : "#60a5fa";

        // Step 1: choose language
        if (!pickerLang) return (
            <div onClick={e => e.stopPropagation()} style={{ position: "absolute", inset: 0, zIndex: 20, background: th.bg + "F4", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 24px 24px", gap: "20px", overflowY: "auto" }}>
                <button onClick={closePicker} style={{ position: "absolute", top: "16px", right: "16px", width: "32px", height: "32px", borderRadius: "50%", border: "1px solid " + th.border, background: "transparent", color: th.sub, cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.4rem", letterSpacing: "0.1em", color: th.text }}>CHOOSE A LANGUAGE</div>
                <input autoFocus value={pickerSearch} onChange={e => setPickerSearch(e.target.value)}
                       placeholder="Search languages…"
                       style={{ width: "100%", maxWidth: "400px", padding: "10px 16px", borderRadius: "8px", border: "1px solid " + th.border, background: th.card, color: th.text, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.85rem", outline: "none" }}
                />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", maxWidth: "800px" }}>
                    {filteredLangs.map(lang => {
                        const cat   = CATEGORIES[lang.cat];
                        const clr   = cat?.color ?? "#FF7A00";
                        return (
                            <div key={lang.id} onClick={(e) => { e.stopPropagation(); handlePickLang(lang); }}
                                 style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "9px", border: "1px solid " + clr + "33", background: th.card, cursor: "pointer", transition: "all .15s", minWidth: "150px" }}
                                 onMouseEnter={e => { e.currentTarget.style.borderColor = clr + "88"; e.currentTarget.style.background = clr + "10"; }}
                                 onMouseLeave={e => { e.currentTarget.style.borderColor = clr + "33"; e.currentTarget.style.background = th.card; }}
                            >
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid " + clr + "66", borderRadius: "5px", padding: "2px 8px", background: th.bg, flexShrink: 0 }}>
                                    <span style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.2rem", color: clr, lineHeight: 1 }}>{lang.sym}</span>
                                </div>
                                <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.78rem", fontWeight: 700, color: th.text }}>{lang.name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );

        // Error state (e.g. path not generated)
        if (pickerError) return (
            <div onClick={e => e.stopPropagation()} style={{ position: "absolute", inset: 0, zIndex: 20, background: th.bg + "F4", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
                <div style={{ fontSize: "2.5rem" }}>⚠️</div>
                <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.1rem", letterSpacing: "0.08em", color: th.text, textAlign: "center", maxWidth: "400px" }}>{pickerError}</div>
                <button onClick={() => { setPickerError(null); }} style={{ padding: "8px 20px", borderRadius: "8px", border: "1px solid " + color, background: "transparent", color, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.8rem" }}>← Back</button>
            </div>
        );

        // Loading roadmap
        if (pickerLoading) return (
            <div onClick={e => e.stopPropagation()} style={{ position: "absolute", inset: 0, zIndex: 20, background: th.bg + "F4", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
                <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.3rem", letterSpacing: "0.08em", background: "linear-gradient(135deg," + color + ",#FFA94D)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    LOADING {pickerLang.name.toUpperCase()}…
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                    {[0,1,2,3,4].map(i => (
                        <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, animation: "rmDot 1.2s ease-in-out infinite", animationDelay: (i * 0.15) + "s", opacity: 0.3 }} />
                    ))}
                </div>
                <style>{`@keyframes rmDot { 0%,80%,100%{opacity:.3;transform:scale(1)} 40%{opacity:1;transform:scale(1.4)} }`}</style>
            </div>
        );

        // Generating state
        if (pickerGenerating) return (
            <div onClick={e => e.stopPropagation()} style={{ position: "absolute", inset: 0, zIndex: 20, background: th.bg + "F4", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
                <button onClick={() => { setPickerLang(null); setPickerRoadmap(null); setPickerGenerating(false); }} style={{ position: "absolute", top: "16px", left: "16px", padding: "5px 12px", borderRadius: "7px", border: "1px solid " + th.border, background: "transparent", color: th.sub, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.72rem" }}>← Back</button>
                <div style={{ fontSize: "2.5rem" }}>⚙️</div>
                <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.3rem", letterSpacing: "0.08em", background: "linear-gradient(135deg," + color + ",#FFA94D)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    GENERATING {pickerLang.name.toUpperCase()} ROADMAP…
                </div>
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.8rem", color: th.sub }}>This usually takes 1–2 minutes</div>
                <div style={{ display: "flex", gap: "8px" }}>
                    {[0,1,2,3,4].map(i => (
                        <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, animation: "rmDot 1.2s ease-in-out infinite", animationDelay: (i * 0.15) + "s", opacity: 0.3 }} />
                    ))}
                </div>
                <style>{`@keyframes rmDot { 0%,80%,100%{opacity:.3;transform:scale(1)} 40%{opacity:1;transform:scale(1.4)} }`}</style>
            </div>
        );

        // Step 2: choose core or path
        if (pickerRoadmap) {
            const hasCore  = (pickerRoadmap.core?.length ?? 0) > 0;
            const hasPaths = pickerRoadmap.paths?.length > 0;
            const activePaths = pickerCat ? (pathCategories.find(c => c.label === pickerCat)?.paths ?? []) : [];

            return (
                <div onClick={e => e.stopPropagation()} style={{ position: "absolute", inset: 0, zIndex: 20, background: th.bg + "F4", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 24px 24px", gap: "20px", overflowY: "auto" }}>
                    <button onClick={() => { setPickerLang(null); setPickerRoadmap(null); }} style={{ position: "absolute", top: "16px", left: "16px", padding: "5px 12px", borderRadius: "7px", border: "1px solid " + th.border, background: "transparent", color: th.sub, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.72rem" }}>← Back</button>
                    <button onClick={closePicker} style={{ position: "absolute", top: "16px", right: "16px", width: "32px", height: "32px", borderRadius: "50%", border: "1px solid " + th.border, background: "transparent", color: th.sub, cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ border: "1.5px solid " + color, borderRadius: "7px", padding: "4px 12px", background: th.bg }}>
                            <span style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.6rem", color, lineHeight: 1 }}>{pickerLang.sym}</span>
                        </div>
                        <div>
                            <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.3rem", letterSpacing: "0.06em", color: th.text }}>{pickerLang.name.toUpperCase()}</div>
                            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.72rem", color: th.sub }}>Choose what to compare</div>
                        </div>
                    </div>

                    {/* Core option */}
                    <div onClick={() => handleConfirm(null, pickingSlot)}
                         style={{ width: "100%", maxWidth: "500px", padding: "16px 20px", borderRadius: "10px", border: "2px solid " + color + "44", background: th.card, cursor: "pointer", transition: "all .2s", display: "flex", alignItems: "center", gap: "14px" }}
                         onMouseEnter={e => { e.currentTarget.style.borderColor = color + "99"; e.currentTarget.style.background = color + "10"; }}
                         onMouseLeave={e => { e.currentTarget.style.borderColor = color + "44"; e.currentTarget.style.background = th.card; }}
                    >
                        <span style={{ fontSize: "1.5rem" }}>⬡</span>
                        <div>
                            <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1rem", letterSpacing: "0.06em", color: th.text }}>Core Roadmap</div>
                            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.68rem", color: th.sub }}>
                                {pickerRoadmap.core?.length ?? 0} phases · {(pickerRoadmap.core ?? []).flatMap(p => p.topics ?? []).length} topics
                            </div>
                        </div>
                    </div>

                    {hasPaths && (
                        <>
                            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.7rem", color: th.dim, letterSpacing: "0.08em", textTransform: "uppercase" }}>or choose a specialization path</div>

                            {/* Category tabs */}
                            {!skipCat && !pickerCat && (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", maxWidth: "700px" }}>
                                    {pathCategories.map(cat => (
                                        <div key={cat.label} onClick={() => setPickerCat(cat.label)}
                                             style={{ padding: "12px 18px", borderRadius: "10px", border: "1px solid " + color + "33", background: th.card, cursor: "pointer", transition: "all .2s", display: "flex", flexDirection: "column", gap: "6px", minWidth: "140px", alignItems: "center" }}
                                             onMouseEnter={e => { e.currentTarget.style.borderColor = color + "88"; e.currentTarget.style.background = color + "10"; }}
                                             onMouseLeave={e => { e.currentTarget.style.borderColor = color + "33"; e.currentTarget.style.background = th.card; }}
                                        >
                                            <span style={{ fontSize: "1.6rem" }}>{cat.icon}</span>
                                            <span style={{ fontFamily: "'Bebas Neue',display", fontSize: "0.9rem", letterSpacing: "0.06em", color: th.text }}>{cat.label}</span>
                                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.58rem", color: th.dim }}>{cat.paths.length} paths</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Path list */}
                            {(skipCat || pickerCat) && (
                                <>
                                    {!skipCat && pickerCat && (
                                        <button onClick={() => setPickerCat(null)} style={{ padding: "5px 12px", borderRadius: "7px", border: "1px solid " + th.border, background: "transparent", color: th.sub, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.72rem" }}>← Categories</button>
                                    )}
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", maxWidth: "700px" }}>
                                        {(skipCat ? pickerRoadmap.paths : activePaths).map(path => {
                                            const alreadyUsed = otherItem?.id === `${pickerLang.name}::${path.id}` || currentItem?.id === `${pickerLang.name}::${path.id}`;
                                            const notGenerated = path.status === 'not_cached';
                                            const disabled = alreadyUsed || notGenerated;
                                            return (
                                                <div key={path.id} onClick={() => !disabled && handleConfirm(path.id, pickingSlot)}
                                                     style={{ width: "180px", padding: "14px 16px", borderRadius: "10px", border: "1px solid " + (disabled ? th.border : color + "33"), background: disabled ? th.bg : th.card, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1, transition: "all .2s", display: "flex", flexDirection: "column", gap: "6px", position: "relative" }}
                                                     onMouseEnter={e => { if (!disabled) { e.currentTarget.style.borderColor = color + "88"; e.currentTarget.style.background = color + "10"; } }}
                                                     onMouseLeave={e => { if (!disabled) { e.currentTarget.style.borderColor = color + "33"; e.currentTarget.style.background = th.bg; } }}
                                                >
                                                    {notGenerated && (
                                                        <span style={{ position: "absolute", top: "8px", right: "8px", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.5rem", padding: "2px 6px", borderRadius: "4px", background: th.border, color: th.dim, letterSpacing: "0.05em" }}>SOON</span>
                                                    )}
                                                    <span style={{ fontSize: "1.6rem" }}>{path.icon}</span>
                                                    <span style={{ fontFamily: "'Bebas Neue',display", fontSize: "0.9rem", letterSpacing: "0.06em", color: th.text }}>{path.label}</span>
                                                    <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.68rem", color: th.sub, lineHeight: 1.4 }}>{path.description}</span>
                                                    {alreadyUsed && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.55rem", color: th.dim }}>already comparing</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            );
        }

        return null;
    };

    // ── Main render ───────────────────────────────────────────────────────────
    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 110, background: th.bg + "F8", backdropFilter: "blur(10px)", display: "flex", flexDirection: "column" }}>

            {/* Header */}
            <div style={{ height: "56px", flexShrink: 0, display: "flex", alignItems: "center", padding: "0 20px", gap: "16px", borderBottom: "1px solid " + th.border, background: th.card + "EE" }}>
                <span style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.3rem", letterSpacing: "0.08em", color: th.text }}>Roadmap Comparison</span>
                {a && b && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "3px 10px", borderRadius: "99px", border: "1px solid rgba(96,165,250,0.3)", background: "rgba(96,165,250,0.08)" }}>
                        <span style={{ fontSize: "0.6rem", color: "#60a5fa" }}>⇄</span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.6rem", color: "#60a5fa" }}>{shared.size} shared topic{shared.size !== 1 ? "s" : ""}</span>
                    </div>
                )}
                <div style={{ flex: 1 }} />
                {a && b && (
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <span style={{ fontSize: "0.65rem", color: "#60a5fa" }}>⇄</span>
                            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.65rem", color: th.sub }}>shared</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <span style={{ fontSize: "0.55rem", color: th.dim }}>·</span>
                            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.65rem", color: th.sub }}>unique</span>
                        </div>
                    </div>
                )}
                <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid " + th.border, background: th.card, color: th.sub, cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px", position: "relative" }}>

                {/* Item headers */}
                <div style={{ display: "flex", gap: "16px" }}>
                    <ItemHeader item={a} slot={0} />
                    <ItemHeader item={b} slot={1} />
                </div>

                {/* Stats row */}
                {a && b && (
                    <div style={{ display: "flex", gap: "16px" }}>
                        {[
                            { label: "Total topics", valA: totalA,            valB: totalB },
                            { label: "Shared",        valA: shared.size,       valB: shared.size, isShared: true },
                            { label: "Unique",        valA: totalA - shared.size, valB: totalB - shared.size },
                            { label: "Phases",        valA: a.phases?.length ?? 0, valB: b.phases?.length ?? 0 },
                        ].map(stat => {
                            const colA = CATEGORIES[a.lang.cat]?.color ?? "#FF7A00";
                            const colB = CATEGORIES[b.lang.cat]?.color ?? "#60a5fa";
                            const winA = stat.valA > stat.valB;
                            const winB = stat.valB > stat.valA;
                            return (
                                <div key={stat.label} style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid " + th.border, background: th.card, display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.62rem", color: th.dim, textTransform: "uppercase", letterSpacing: "0.08em" }}>{stat.label}</span>
                                    <div style={{ display: "flex", gap: "10px", alignItems: "baseline" }}>
                                        <span style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.6rem", color: stat.isShared ? "#60a5fa" : winA ? colA : th.sub, lineHeight: 1 }}>{stat.valA}</span>
                                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.6rem", color: th.dim }}>vs</span>
                                        <span style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.6rem", color: stat.isShared ? "#60a5fa" : winB ? colB : th.sub, lineHeight: 1 }}>{stat.valB}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Side by side phases */}
                {a && b && (
                    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                        <PhaseColumn item={a} otherLabels={labelsB} />
                        <div style={{ width: "1px", background: th.border, alignSelf: "stretch", flexShrink: 0, marginTop: "8px" }} />
                        <PhaseColumn item={b} otherLabels={labelsA} />
                    </div>
                )}

                {(!a || !b) && !pickingSlot && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: "12px", paddingTop: "60px" }}>
                        <div style={{ fontSize: "2.5rem" }}>⇄</div>
                        <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.2rem", letterSpacing: "0.06em", color: th.sub }}>Add a second roadmap to compare</div>
                        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.78rem", color: th.dim }}>Click the slot above to choose a language and path</div>
                    </div>
                )}

                {/* Picker overlay — sits inside the scrollable area */}
                {pickingSlot !== null && <PickerOverlay />}
            </div>
        </div>
    );
}