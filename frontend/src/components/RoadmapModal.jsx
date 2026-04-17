import { useEffect, useState, useCallback, useRef } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    useNodesState,
    useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CATEGORIES } from "../data/index.js";
import html2canvas from "html2canvas";

const flowOverride = (th) => `
  .react-flow__controls { background: ${th.card} !important; border: 1px solid ${th.border} !important; border-radius: 8px !important; box-shadow: none !important; }
  .react-flow__controls-button { background: ${th.card} !important; border-bottom: 1px solid ${th.border} !important; color: ${th.sub} !important; fill: ${th.sub} !important; }
  .react-flow__controls-button:hover { background: ${th.border} !important; }
  .react-flow__controls-button svg { fill: ${th.sub} !important; }
  .react-flow__controls-button:last-child { border-bottom: none !important; }
`;

const PHASE_W     = 240;
const PHASE_GAP   = 60;
const TOPIC_H     = 130;
const TOPIC_GAP   = 16;
const TOPIC_TOP   = 190;
const PHASE_HDR_H = 74;

const TYPE_CONFIG = {
    required: { label: "Required", dot: "#4ade80" },
    optional: { label: "Optional", dot: "#60a5fa" },
    advanced: { label: "Advanced", dot: "#f472b6" },
};

// ── Storage ───────────────────────────────────────────────────────────────────
const storageKey    = (lang) => `ptl_progress_${lang}`;
const storageGenKey = (lang) => `ptl_progress_gen_${lang}`;
const pathKey       = (lang) => `ptl_path_${lang}`;
const loadProgress  = (lang, generatedAt) => {
    try {
        const savedGen = localStorage.getItem(storageGenKey(lang));
        if (generatedAt && savedGen !== String(generatedAt)) {
            localStorage.removeItem(storageKey(lang));
            localStorage.setItem(storageGenKey(lang), String(generatedAt));
            return new Set();
        }
        return new Set(JSON.parse(localStorage.getItem(storageKey(lang))) ?? []);
    } catch { return new Set(); }
};
const saveProgress  = (lang, set) => localStorage.setItem(storageKey(lang), JSON.stringify([...set]));
const loadPath      = (lang) => { try { return localStorage.getItem(pathKey(lang)) || null; } catch { return null; } };
const savePath = (lang, pathId) => { if (pathId) localStorage.setItem(pathKey(lang), pathId); else localStorage.removeItem(pathKey(lang)); };

// ── Compute unlocked topics ───────────────────────────────────────────────────
function computeUnlocked(roadmap, progress, selectedPathId) {
    const unlocked = new Set();
    if (!roadmap) return unlocked;

    const core = roadmap.core ?? [];

    core.forEach((phase, pIdx) => {
        (phase.topics ?? []).forEach((topic, tIdx) => {
            if (pIdx === 0 && tIdx === 0) {
                unlocked.add(topic.id);
            } else if (tIdx === 0) {
                const prevTopics = core[pIdx - 1]?.topics ?? [];
                if (prevTopics.length > 0 && prevTopics.every(t => progress.has(t.id))) unlocked.add(topic.id);
            } else {
                if (progress.has(phase.topics[tIdx - 1].id)) unlocked.add(topic.id);
            }
        });
    });

    const allCoreTopics = core.flatMap(p => p.topics ?? []);
    const coreDone      = allCoreTopics.length > 0 && allCoreTopics.every(t => progress.has(t.id));

    if (coreDone && selectedPathId) {
        const path = (roadmap.paths ?? []).find(p => p.id === selectedPathId);
        if (path) {
            (path.phases ?? []).forEach((phase, pIdx) => {
                (phase.topics ?? []).forEach((topic, tIdx) => {
                    if (pIdx === 0 && tIdx === 0) {
                        unlocked.add(topic.id);
                    } else if (tIdx === 0) {
                        const prevTopics = path.phases[pIdx - 1]?.topics ?? [];
                        if (prevTopics.length > 0 && prevTopics.every(t => progress.has(t.id))) unlocked.add(topic.id);
                    } else {
                        if (progress.has(phase.topics[tIdx - 1].id)) unlocked.add(topic.id);
                    }
                });
            });
        }
    }

    return unlocked;
}

// ── Phase node ────────────────────────────────────────────────────────────────
function PhaseNode({ data }) {
    const total    = data.topicCount ?? 0;
    const done     = data.doneCount  ?? 0;
    const pct      = total > 0 ? Math.round((done / total) * 100) : 0;
    const complete = pct === 100;

    return (
        <div style={{
            width: PHASE_W + "px", minHeight: PHASE_HDR_H + "px", borderRadius: "10px",
            border: "2px solid " + (complete ? data.color + "CC" : data.color + "88"),
            background: complete
                ? "linear-gradient(135deg," + data.color + "33," + data.color + "14)"
                : "linear-gradient(135deg," + data.color + "22," + data.color + "08)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "8px 14px 10px",
            boxShadow: complete ? "0 0 32px " + data.color + "44" : "0 0 24px " + data.color + "22",
            cursor: "default", userSelect: "none", gap: "6px",
        }}>
            {data.isPath && (
                <div style={{ fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: data.color + "99", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700 }}>
                    {data.pathIcon} {data.pathLabel}
                </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {complete && <span style={{ fontSize: "0.75rem" }}>✓</span>}
                <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.05rem", letterSpacing: "0.08em", color: data.color, lineHeight: 1, textAlign: "center" }}>{data.label}</div>
            </div>
            {data.description && (
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.6rem", color: data.color + "99", textAlign: "center", lineHeight: 1.3 }}>{data.description}</div>
            )}
            {total > 0 && (
                <div style={{ width: "100%", marginTop: "2px" }}>
                    <div style={{ width: "100%", height: "4px", borderRadius: "99px", background: data.color + "22", overflow: "hidden" }}>
                        <div style={{ width: pct + "%", height: "100%", background: complete ? data.color : data.color + "99", borderRadius: "99px", transition: "width .4s ease" }} />
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.55rem", color: data.color + "88", marginTop: "3px", textAlign: "right" }}>{done}/{total}</div>
                </div>
            )}
        </div>
    );
}

// ── Topic node ────────────────────────────────────────────────────────────────
function TopicNode({ data }) {
    const cfg    = TYPE_CONFIG[data.type] ?? TYPE_CONFIG.required;
    const [hov, setHov] = useState(false);

    const handleCheck = (e) => { e.stopPropagation(); if (data.locked) return; data.onToggle && data.onToggle(data.id); };

    return (
        <div
            onMouseEnter={() => !data.locked && setHov(true)}
            onMouseLeave={() => setHov(false)}
            onClick={() => !data.locked && data.onSelect && data.onSelect(data)}
            style={{
                width: PHASE_W + "px", minHeight: TOPIC_H + "px", borderRadius: "8px",
                border: "1.5px solid " + (data.locked ? data.borderColor + "22" : data.completed ? data.color + "88" : data.selected ? data.color + "CC" : hov ? data.color + "99" : data.color + "33"),
                background: data.locked ? data.cardBg : data.completed ? data.color + "10" : data.selected ? data.color + "22" : hov ? data.color + "18" : data.cardBg,
                display: "flex", flexDirection: "column", justifyContent: "center",
                padding: "10px 14px", transition: "all 0.15s ease",
                boxShadow: !data.locked && data.selected ? "0 0 0 2px " + data.color + "55, 0 4px 20px " + data.color + "33" : !data.locked && hov ? "0 4px 20px " + data.color + "33" : "none",
                cursor: data.locked ? "not-allowed" : "pointer",
                userSelect: "none", boxSizing: "border-box",
                opacity: data.locked ? 0.35 : data.completed ? 0.75 : 1,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: data.locked ? data.borderColor + "33" : cfg.dot, flexShrink: 0, boxShadow: !data.locked && (hov || data.selected) ? "0 0 6px " + cfg.dot : "none" }} />
                <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.78rem", fontWeight: 700, color: data.locked ? data.borderColor + "44" : data.completed ? data.color + "AA" : data.selected || hov ? data.color : data.textColor, lineHeight: 1.2, letterSpacing: "0.01em", flex: 1, textDecoration: data.completed ? "line-through" : "none" }}>
                    {data.label}
                </span>
                {data.locked
                    ? <span style={{ fontSize: "0.65rem", opacity: 0.3 }}>🔒</span>
                    : <div onClick={handleCheck} title={data.completed ? "Mark as incomplete" : "Mark as complete"}
                           style={{ width: "18px", height: "18px", borderRadius: "50%", border: "1.5px solid " + (data.completed ? data.color : data.color + "44"), background: data.completed ? data.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .15s", fontSize: "0.6rem", color: data.completed ? "#fff" : data.color + "88" }}>
                        {data.completed ? "✓" : ""}
                    </div>
                }
            </div>
            {data.description && (
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.6rem", color: data.locked ? data.borderColor + "33" : data.subColor, lineHeight: 1.45, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>{data.description}</div>
            )}
        </div>
    );
}

const NODE_TYPES = { phase: PhaseNode, topic: TopicNode };

// ── Path selector overlay ─────────────────────────────────────────────────────
function PathSelector({ paths, color, th, selectedPathId, onSelect, onClose }) {
    const categories = [];
    const catMap     = {};
    paths.forEach(path => {
        const cat = path.category || path.label;
        const ico = path.category_icon || path.icon;
        if (!catMap[cat]) {
            catMap[cat] = { label: cat, icon: ico, paths: [] };
            categories.push(catMap[cat]);
        }
        catMap[cat].paths.push(path);
    });

    const skipCategory      = categories.length <= 1;
    const [activeCat, setCat] = useState(skipCategory ? (categories[0]?.label ?? null) : null);
    const activePaths       = activeCat ? (catMap[activeCat]?.paths ?? []) : [];

    return (
        <div style={{ position: "absolute", inset: 0, zIndex: 20, background: th.bg + "EE", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "28px", padding: "40px", overflowY: "auto" }}>
            <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "2rem", letterSpacing: "0.1em", background: "linear-gradient(135deg," + color + ",#FFA94D)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px" }}>
                    {activeCat ? activeCat.toUpperCase() : "CHOOSE A SPECIALIZATION"}
                </div>
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.85rem", color: th.sub }}>
                    {activeCat ? "Select a specific path to continue" : "Choose a domain to explore your options"}
                </div>
            </div>

            {activeCat && !skipCategory && (
                <button onClick={() => setCat(null)} style={{ position: "absolute", top: "20px", left: "20px", padding: "6px 14px", borderRadius: "7px", border: "1px solid " + th.border, background: "transparent", color: th.sub, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.75rem", cursor: "pointer" }}>
                    ← Back
                </button>
            )}

            {onClose && (
                <button onClick={onClose} style={{ position: "absolute", top: "20px", right: "20px", width: "32px", height: "32px", borderRadius: "50%", border: "1px solid " + th.border, background: "transparent", color: th.sub, cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            )}

            {!activeCat && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center", maxWidth: "900px" }}>
                    {categories.map(cat => (
                        <div key={cat.label} onClick={() => setCat(cat.label)}
                             style={{ width: "200px", padding: "20px", borderRadius: "12px", border: "2px solid " + color + "33", background: th.card, cursor: "pointer", transition: "all .2s", display: "flex", flexDirection: "column", gap: "8px" }}
                             onMouseEnter={e => { e.currentTarget.style.borderColor = color + "99"; e.currentTarget.style.background = color + "12"; }}
                             onMouseLeave={e => { e.currentTarget.style.borderColor = color + "33"; e.currentTarget.style.background = th.card; }}
                        >
                            <div style={{ fontSize: "2rem" }}>{cat.icon}</div>
                            <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1rem", letterSpacing: "0.06em", color: th.text }}>{cat.label}</div>
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.6rem", color: th.dim }}>{cat.paths.length} path{cat.paths.length !== 1 ? "s" : ""}</div>
                        </div>
                    ))}
                </div>
            )}

            {activeCat && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center", maxWidth: "900px" }}>
                    {activePaths.map(path => {
                        const isSelected   = selectedPathId === path.id;
                        const notGenerated = path.status === "not_cached";
                        return (
                            <div key={path.id} onClick={() => { if (!notGenerated) onSelect(path.id); }}
                                 style={{ width: "200px", padding: "20px", borderRadius: "12px", border: "2px solid " + (isSelected ? color + "CC" : color + "33"), background: isSelected ? color + "18" : th.card, cursor: notGenerated ? "not-allowed" : "pointer", transition: "all .2s", boxShadow: isSelected ? "0 0 24px " + color + "44" : "none", display: "flex", flexDirection: "column", gap: "8px", opacity: notGenerated ? 0.5 : 1, position: "relative" }}
                                 onMouseEnter={e => { if (!isSelected && !notGenerated) { e.currentTarget.style.borderColor = color + "77"; e.currentTarget.style.background = color + "0C"; } }}
                                 onMouseLeave={e => { if (!isSelected && !notGenerated) { e.currentTarget.style.borderColor = color + "33"; e.currentTarget.style.background = th.card; } }}
                            >
                                {notGenerated && <span style={{ position: "absolute", top: "8px", right: "8px", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.5rem", padding: "2px 6px", borderRadius: "4px", background: th.border, color: th.dim, letterSpacing: "0.05em" }}>SOON</span>}
                                <div style={{ fontSize: "2rem" }}>{path.icon}</div>
                                <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1rem", letterSpacing: "0.06em", color: isSelected ? color : th.text }}>{path.label}</div>
                                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.7rem", color: th.sub, lineHeight: 1.5 }}>{path.description}</div>
                                {isSelected && <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.6rem", color }}>✓ Selected</div>}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ── Topic detail panel ────────────────────────────────────────────────────────
function TopicPanel({ topic, color, th, onClose, completed, onToggle }) {
    const [mounted, setMounted] = useState(false);
    const cfg = TYPE_CONFIG[topic?.type] ?? TYPE_CONFIG.required;

    useEffect(() => { const t = setTimeout(() => setMounted(true), 12); return () => clearTimeout(t); }, [topic?.id]);
    if (!topic) return null;

    return (
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "320px", zIndex: 10, background: th.card, borderLeft: "1px solid " + th.border, display: "flex", flexDirection: "column", transform: mounted ? "translateX(0)" : "translateX(100%)", transition: "transform .28s cubic-bezier(.4,0,.2,1)", boxShadow: "-8px 0 32px rgba(0,0,0,0.3)" }}>
            <div style={{ padding: "16px 18px 14px", borderBottom: "1px solid " + th.border, flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: cfg.dot, boxShadow: "0 0 6px " + cfg.dot }} />
                        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.65rem", color: cfg.dot, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{cfg.label}</span>
                    </div>
                    <button onClick={onClose} style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid " + th.border, background: "transparent", color: th.dim, cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </div>
                <h3 style={{ margin: "0 0 12px", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "1rem", fontWeight: 700, color: th.text, lineHeight: 1.3 }}>{topic.label}</h3>
                <button onClick={() => onToggle(topic.id)}
                        style={{ width: "100%", padding: "8px", borderRadius: "7px", border: "1.5px solid " + (completed ? color + "88" : color + "44"), background: completed ? color + "22" : "transparent", color: completed ? color : th.sub, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <span>{completed ? "✓" : "○"}</span>
                    <span>{completed ? "Completed" : "Mark as complete"}</span>
                </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {topic.description && <p style={{ margin: 0, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: th.sub }}>{topic.description}</p>}
                {topic.resources?.length > 0 && (
                    <div>
                        <div style={{ fontSize: "0.57rem", letterSpacing: "0.12em", textTransform: "uppercase", color: th.dim, marginBottom: "8px", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700 }}>Resources</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {topic.resources.map((r, i) => {
                                const isUrl = typeof r === "string" && r.startsWith("http");
                                return isUrl ? (
                                    <a key={i} href={r} target="_blank" rel="noopener noreferrer"
                                       style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "7px", border: "1px solid " + th.border, background: th.bg, color: th.sub, textDecoration: "none", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.75rem", transition: "all .14s" }}
                                       onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }}
                                       onMouseLeave={e => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.color = th.sub; }}>
                                        <span style={{ opacity: 0.5 }}>↗</span>
                                        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{new URL(r).hostname.replace("www.", "")}</span>
                                    </a>
                                ) : (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "7px", border: "1px solid " + th.border, background: th.bg, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.75rem", color: th.sub }}>
                                        <span style={{ color, opacity: 0.7 }}>→</span><span>{r}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {(!topic.resources || topic.resources.length === 0) && (
                    <div style={{ padding: "14px", borderRadius: "8px", border: "1px dashed " + th.border, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.75rem", color: th.dim, textAlign: "center" }}>No resources linked for this topic.</div>
                )}
            </div>
            <div style={{ height: "3px", background: "linear-gradient(90deg,transparent," + color + ",transparent)", flexShrink: 0 }} />
        </div>
    );
}

// ── Build nodes ───────────────────────────────────────────────────────────────
function buildGraph(roadmap, catColor, th, selectedId, progress, selectedPathId, onSelect, onToggle) {
    if (!roadmap) return { nodes: [], edges: [] };

    const unlocked = computeUnlocked(roadmap, progress, selectedPathId);
    const nodes    = [];
    let   colIdx   = 0;

    const makePhaseNode = (phase, isPath, pathLabel, pathIcon) => {
        const x          = colIdx * (PHASE_W + PHASE_GAP);
        const topicCount = phase.topics?.length ?? 0;
        const doneCount  = (phase.topics ?? []).filter(t => progress.has(t.id)).length;

        nodes.push({
            id: phase.id, type: "phase", position: { x, y: 0 },
            data: { label: phase.label, description: phase.description, color: catColor, topicCount, doneCount, isPath, pathLabel, pathIcon },
            draggable: false,
        });

        (phase.topics ?? []).forEach((topic, tIdx) => {
            const y      = TOPIC_TOP + tIdx * (TOPIC_H + TOPIC_GAP);
            const locked = !unlocked.has(topic.id);

            nodes.push({
                id: topic.id, type: "topic", position: { x, y },
                data: { ...topic, color: catColor, cardBg: th.card, borderColor: th.sub, textColor: th.text, subColor: th.sub, selected: selectedId === topic.id, completed: !locked && progress.has(topic.id), locked, onSelect, onToggle },
                draggable: false,
            });
        });

        colIdx++;
    };

    (roadmap.core ?? []).forEach(phase => makePhaseNode(phase, false, null, null));

    if (selectedPathId) {
        const path = (roadmap.paths ?? []).find(p => p.id === selectedPathId);
        if (path) {
            (path.phases ?? []).forEach(phase => makePhaseNode(phase, true, path.label, path.icon));
        }
    }

    return { nodes, edges: [] };
}

// ── Progress stats ────────────────────────────────────────────────────────────
function OverallProgress({ roadmap, progress, selectedPathId, color, th }) {
    const coreTopics = (roadmap.core ?? []).flatMap(p => p.topics ?? []);
    const path       = (roadmap.paths ?? []).find(p => p.id === selectedPathId);
    const pathTopics = path ? (path.phases ?? []).flatMap(p => p.topics ?? []) : [];
    const allTopics  = [...coreTopics, ...pathTopics];
    const total      = allTopics.length;
    const done       = allTopics.filter(t => progress.has(t.id)).length;
    const pct        = total > 0 ? Math.round((done / total) * 100) : 0;

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "80px", height: "4px", borderRadius: "99px", background: th.border, overflow: "hidden" }}>
                <div style={{ width: pct + "%", height: "100%", background: color, borderRadius: "99px", transition: "width .4s ease" }} />
            </div>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.62rem", color: th.sub }}>{done}/{total}</span>
        </div>
    );
}

function RoadmapLoading({ lang, color, th }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "18px", background: th.bg }}>
            <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.6rem", letterSpacing: "0.1em", background: "linear-gradient(135deg," + color + ",#FFA94D)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                LOADING {lang.toUpperCase()} ROADMAP…
            </div>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.8rem", color: th.dim }}>
                Fetching from database…
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
                {[0,1,2,3,4].map(i => (
                    <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, animation: "rmDot 1.2s ease-in-out infinite", animationDelay: (i * 0.15) + "s", opacity: 0.3 }} />
                ))}
            </div>
            <style>{`@keyframes rmDot { 0%,80%,100%{opacity:.3;transform:scale(1)} 40%{opacity:1;transform:scale(1.4)} }`}</style>
        </div>
    );
}

// ── Main modal ────────────────────────────────────────────────────────────────
export default function RoadmapModal({ lang, roadmap, loading, error, onClose, T, fetchPath, pathLoading, pathError, onAddToCompare, inCompare }) {
    const th    = T || { bg: "#0B0F19", card: "#111827", border: "#1F2937", text: "#F9FAFB", sub: "#9CA3AF", dim: "#6B7280" };
    const cat   = CATEGORIES[lang.cat];
    const color = cat?.color ?? "#FF7A00";

    const [rfNodes, setRfNodes]           = useNodesState([]);
    const [rfEdges, setRfEdges]           = useEdgesState([]);
    const [selectedTopic, setSelected]    = useState(null);
    const [progress, setProgress]         = useState(() => loadProgress(lang.name, roadmap?.generated_at));
    const [selectedPathId, setPathId]     = useState(() => loadPath(lang.name));
    const [showPathPicker, setShowPicker] = useState(false);
    const [copied, setCopied]             = useState(false);
    const modalRef                        = useRef(null);

    const coreTopics = roadmap ? (roadmap.core ?? []).flatMap(p => p.topics ?? []) : [];
    const coreDone   = coreTopics.length > 0 && coreTopics.every(t => progress.has(t.id));

    const handleSelect   = useCallback((data) => { setSelected(prev => prev?.id === data.id ? null : data); }, []);
    const handleDeselect = useCallback(() => setSelected(null), []);
    const handleToggle   = useCallback((topicId) => {
        setProgress(prev => {
            const next = new Set(prev);
            if (next.has(topicId)) {
                const allTopics = [];
                (roadmap?.core ?? []).forEach(p => (p.topics ?? []).forEach(t => allTopics.push(t.id)));
                const path = (roadmap?.paths ?? []).find(p => p.id === selectedPathId);
                if (path) (path.phases ?? []).forEach(p => (p.topics ?? []).forEach(t => allTopics.push(t.id)));
                const completedInOrder = allTopics.filter(id => next.has(id));
                const lastCompleted    = completedInOrder[completedInOrder.length - 1];
                if (topicId !== lastCompleted) return prev;
                next.delete(topicId);
            } else {
                next.add(topicId);
            }
            saveProgress(lang.name, next);
            return next;
        });
    }, [lang.name, roadmap, selectedPathId]);

    const handleSelectPath = useCallback(async (pathId) => {
        setPathId(pathId);
        savePath(lang.name, pathId);
        setShowPicker(false);
        const path = (roadmap?.paths ?? []).find(p => p.id === pathId);
        if (path && !path.phases && fetchPath) {
            await fetchPath(lang.name, pathId);
        }
    }, [lang.name, roadmap, fetchPath]);

    // Auto-fetch path when selected but not yet loaded
    useEffect(() => {
        if (!selectedPathId || !roadmap || !fetchPath) return;
        const path = (roadmap.paths ?? []).find(p => p.id === selectedPathId);
        if (path && !path.phases) {
            fetchPath(lang.name, selectedPathId);
        }
    }, [selectedPathId, roadmap, lang.name, fetchPath]);

    const handleReset = useCallback(() => {
        saveProgress(lang.name, new Set());
        savePath(lang.name, null);
        setProgress(new Set());
        setPathId(null);
        setSelected(null);
        setShowPicker(false);
    }, [lang.name]);

    // ── Share ─────────────────────────────────────────────────────────────────
    const handleShare = useCallback(async (e) => {
        const params = new URLSearchParams();
        params.set("roadmap", lang.name);
        if (selectedPathId) params.set("path", selectedPathId);
        const url = window.location.origin + window.location.pathname + "?" + params.toString();

        if (e.shiftKey) {
            try {
                const el = modalRef.current;
                if (!el) return;
                const canvas = await html2canvas(el, { backgroundColor: th.bg, scale: 1.5, useCORS: true, logging: false });
                const a = document.createElement("a");
                a.download = lang.name.toLowerCase().replace(/\s+/g, "-") + "-roadmap.png";
                a.href = canvas.toDataURL("image/png");
                a.click();
            } catch { /* screenshot failed */ }
        } else {
            try { await navigator.clipboard.writeText(url); } catch { /* fallback */ }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [lang.name, selectedPathId, th.bg]);

    // ── Compare ───────────────────────────────────────────────────────────────
    const handleCompare = useCallback(async () => {
        if (!onAddToCompare) return;

        const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

        // Use prop data if available, otherwise fetch fresh
        let rm = roadmap;
        if (!rm || (rm.core?.length ?? 0) === 0) {
            try {
                const res = await fetch(`${API_BASE}/roadmap/${encodeURIComponent(lang.name)}`);
                if (!res.ok) return;
                const json = await res.json();
                rm = json.data ?? json;
            } catch { return; }
        }
        if (!rm || (rm.core?.length ?? 0) === 0) return;

        const selectedPath = (rm.paths ?? []).find(p => p.id === selectedPathId);

        // For paths, fetch path detail if phases are missing
        let phases;
        if (selectedPathId) {
            phases = selectedPath?.phases ?? [];
            if (!phases.length) {
                try {
                    const res = await fetch(`${API_BASE}/roadmap/${encodeURIComponent(lang.name)}/path/${encodeURIComponent(selectedPathId)}?no_generate=1`);
                    if (res.ok) {
                        const json = await res.json();
                        const pathData = json.data ?? json;
                        if (pathData.phases?.length) phases = pathData.phases;
                    }
                } catch { /* keep empty */ }
            }
        } else {
            phases = rm.core ?? [];
        }

        onAddToCompare({
            id:        selectedPathId ? `${lang.name}::${selectedPathId}` : `${lang.name}::core`,
            lang,
            type:      selectedPathId ? "path" : "core",
            pathId:    selectedPathId ?? null,
            pathLabel: selectedPath?.label ?? null,
            pathIcon:  selectedPath?.icon  ?? null,
            phases,
            color,
        });
    }, [onAddToCompare, roadmap, lang, selectedPathId, color]);

    // Auto-show path picker when core is completed
    const prevCoreDone = useRef(false);
    useEffect(() => {
        if (coreDone && !prevCoreDone.current && !selectedPathId && roadmap?.paths?.length > 0) {
            setShowPicker(true);
        }
        prevCoreDone.current = coreDone;
    }, [coreDone, roadmap]);

    useEffect(() => {
        if (roadmap) {
            const { nodes: n, edges: e } = buildGraph(roadmap, color, th, selectedTopic?.id, progress, selectedPathId, handleSelect, handleToggle);
            setRfNodes(n);
            setRfEdges(e);
        }
    }, [roadmap, color, th.card, selectedTopic?.id, progress, selectedPathId, handleSelect, handleToggle]);

    useEffect(() => {
        const fn = (e) => { if (e.key === "Escape") { if (showPathPicker) { setShowPicker(false); return; } if (selectedTopic) setSelected(null); else onClose(); } };
        window.addEventListener("keydown", fn);
        return () => window.removeEventListener("keydown", fn);
    }, [onClose, selectedTopic, showPathPicker]);

    const selectedPath = (roadmap?.paths ?? []).find(p => p.id === selectedPathId);

    return (
        <div ref={modalRef} role="dialog" aria-modal="true" aria-label={lang.name + " roadmap"} style={{ position: "fixed", inset: 0, zIndex: 100, background: th.bg + "F5", backdropFilter: "blur(8px)", display: "flex", flexDirection: "column" }}>
            <style>{flowOverride(th)}</style>

            {/* Header */}
            <div style={{ height: "56px", flexShrink: 0, display: "flex", alignItems: "center", padding: "0 20px", gap: "14px", borderBottom: "1px solid " + th.border, background: th.card + "EE" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid " + color + "55", borderRadius: "8px", padding: "4px 12px", background: color + "12" }}>
                    <span style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.1rem", color, letterSpacing: "0.06em" }}>{lang.sym}</span>
                    <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.82rem", fontWeight: 700, color: th.text }}>{lang.name}</span>
                    <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.68rem", color: th.dim }}>Roadmap</span>
                </div>

                {roadmap?.paths?.length > 0 && (
                    selectedPath ? (
                        <div onClick={() => setShowPicker(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "7px", border: "1px solid " + color + "44", background: color + "10", cursor: "pointer" }}>
                            <span>{selectedPath.icon}</span>
                            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.72rem", color, fontWeight: 600 }}>{selectedPath.label}</span>
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.55rem", color: th.dim }}>change</span>
                        </div>
                    ) : (
                        <div onClick={() => setShowPicker(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "7px", border: "1px dashed " + color + "55", background: color + "08", cursor: "pointer" }}>
                            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.72rem", color: color + "AA", fontWeight: 600 }}>Choose a path →</span>
                        </div>
                    )
                )}

                <div style={{ flex: 1 }} />

                {!loading && roadmap && (
                    <OverallProgress roadmap={roadmap} progress={progress} selectedPathId={selectedPathId} color={color} th={th} />
                )}

                {/* Compare button */}
                {onAddToCompare && !loading && roadmap && (
                    <button
                        onClick={handleCompare}
                        title={inCompare ? "Already in comparison" : "Add to comparison"}
                        style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid " + (inCompare ? color + "88" : th.border), background: inCompare ? color + "18" : "transparent", color: inCompare ? color : th.dim, fontFamily: "'JetBrains Mono',monospace", fontSize: "0.6rem", cursor: inCompare ? "default" : "pointer", transition: "all .2s", display: "flex", alignItems: "center", gap: "5px" }}
                        onMouseEnter={e => { if (!inCompare) { e.currentTarget.style.borderColor = color + "66"; e.currentTarget.style.color = color; } }}
                        onMouseLeave={e => { if (!inCompare) { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.color = th.dim; } }}
                    >
                        {inCompare ? "⇄ added" : "⇄ compare"}
                    </button>
                )}

                {/* Share button */}
                <button
                    onClick={handleShare}
                    title="Copy share link · Shift+click to download screenshot"
                    style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid " + (copied ? "#4ade8055" : th.border), background: copied ? "#4ade8012" : "transparent", color: copied ? "#4ade80" : th.dim, fontFamily: "'JetBrains Mono',monospace", fontSize: "0.6rem", cursor: "pointer", transition: "all .2s", display: "flex", alignItems: "center", gap: "5px" }}
                    onMouseEnter={e => { if (!copied) { e.currentTarget.style.borderColor = th.sub; e.currentTarget.style.color = th.sub; } }}
                    onMouseLeave={e => { if (!copied) { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.color = th.dim; } }}
                >
                    {copied ? "✓ copied" : "⎘ share"}
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "6px", border: "1px solid #FF7A0033", background: "#FF7A0010" }}>
                    <span style={{ fontSize: "0.65rem", color: "#FF7A00", fontFamily: "'JetBrains Mono',monospace" }}>✦ Claude AI</span>
                </div>
                <button
                    onClick={handleReset}
                    title="Reset all progress"
                    style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid " + th.border, background: "transparent", color: th.dim, fontFamily: "'JetBrains Mono',monospace", fontSize: "0.6rem", cursor: "pointer" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#f87171"; e.currentTarget.style.color = "#f87171"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.color = th.dim; }}
                >↺ reset</button>
                <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid " + th.border, background: th.card, color: th.sub, cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                {loading && <RoadmapLoading lang={lang.name} color={color} th={th} />}

                {/* Coming Soon — roadmap not generated yet */}
                {!loading && error === 'not_cached' && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "14px", background: th.bg }}>
                        <div style={{ fontSize: "3rem" }}>🚧</div>
                        <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.4rem", color: th.text, letterSpacing: "0.08em" }}>COMING SOON</div>
                        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.82rem", color: th.sub }}>
                            The <strong style={{ color: th.text }}>{lang.name}</strong> roadmap hasn't been generated yet.
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", color: th.dim }}>Check back later or suggest it via the feedback button.</div>
                    </div>
                )}

                {/* Actual error */}
                {!loading && error && error !== 'not_cached' && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "12px", background: th.bg }}>
                        <div style={{ fontSize: "2rem" }}>⚠️</div>
                        <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.2rem", color: "#f87171", letterSpacing: "0.06em" }}>FAILED TO LOAD ROADMAP</div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.72rem", color: th.dim }}>{error}</div>
                    </div>
                )}

                {!loading && !error && roadmap && (
                    <>
                        <ReactFlow
                            nodes={rfNodes} edges={rfEdges}
                            onNodesChange={() => {}} onEdgesChange={() => {}}
                            nodeTypes={NODE_TYPES}
                            fitView fitViewOptions={{ padding: 0.12 }}
                            minZoom={0.2} maxZoom={2}
                            style={{ background: th.bg }}
                            proOptions={{ hideAttribution: true }}
                            onPaneClick={handleDeselect}
                        >
                            <Background color={th.border} gap={24} size={1} />
                            <Controls />
                        </ReactFlow>

                        {pathLoading && (
                            <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "10px", padding: "10px 20px", borderRadius: "8px", background: th.card, border: "1px solid " + color + "44", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
                                <div style={{ display: "flex", gap: "5px" }}>
                                    {[0,1,2].map(i => (
                                        <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, animation: "rmDot 1.2s ease-in-out infinite", animationDelay: (i * 0.15) + "s", opacity: 0.3 }} />
                                    ))}
                                </div>
                                <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.75rem", color: th.sub }}>Loading path…</span>
                            </div>
                        )}

                        {pathError && (
                            <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "10px", padding: "10px 20px", borderRadius: "8px", background: th.card, border: "1px solid " + (pathError === 'not_cached' ? th.border : "#f8717144"), boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
                                <span style={{ fontSize: "0.9rem" }}>{pathError === 'not_cached' ? '🚧' : '⚠️'}</span>
                                <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.75rem", color: th.sub }}>
                                    {pathError === 'not_cached' ? "This path hasn't been generated yet — coming soon." : "Failed to load path."}
                                </span>
                            </div>
                        )}

                        {showPathPicker && (
                            <PathSelector
                                paths={roadmap.paths ?? []}
                                color={color}
                                th={th}
                                selectedPathId={selectedPathId}
                                onSelect={handleSelectPath}
                                onClose={() => setShowPicker(false)}
                            />
                        )}

                        {selectedTopic && !showPathPicker && (
                            <TopicPanel topic={selectedTopic} color={color} th={th} onClose={handleDeselect} completed={progress.has(selectedTopic.id)} onToggle={handleToggle} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}