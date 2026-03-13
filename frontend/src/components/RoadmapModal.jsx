import { useEffect, useState } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
    MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CATEGORIES } from "../data/index.js";

// ── ReactFlow style overrides ─────────────────────────────────────────────────
const flowOverride = (th) => `
  .react-flow__controls { background: ${th.card} !important; border: 1px solid ${th.border} !important; border-radius: 8px !important; box-shadow: none !important; }
  .react-flow__controls-button { background: ${th.card} !important; border-bottom: 1px solid ${th.border} !important; color: ${th.sub} !important; fill: ${th.sub} !important; }
  .react-flow__controls-button:hover { background: ${th.border} !important; }
  .react-flow__controls-button svg { fill: ${th.sub} !important; }
  .react-flow__controls-button:last-child { border-bottom: none !important; }
`;

// ── Layout constants ──────────────────────────────────────────────────────────
const PHASE_W     = 230;
const PHASE_GAP   = 80;
const TOPIC_H     = 92;
const TOPIC_GAP   = 14;
const TOPIC_TOP   = 110;
const PHASE_HDR_H = 54;

// ── Topic type config ─────────────────────────────────────────────────────────
const TYPE_CONFIG = {
    required: { label: "Required", dot: "#4ade80" },
    optional: { label: "Optional", dot: "#60a5fa" },
    advanced: { label: "Advanced", dot: "#f472b6" },
};

// ── Custom node: Phase header ─────────────────────────────────────────────────
function PhaseNode({ data }) {
    return (
        <div style={{
            width:          PHASE_W + "px",
            minHeight:      PHASE_HDR_H + "px",
            borderRadius:   "10px",
            border:         "2px solid " + data.color + "88",
            background:     "linear-gradient(135deg," + data.color + "22," + data.color + "08)",
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",
            padding:        "8px 14px",
            boxShadow:      "0 0 24px " + data.color + "22",
            cursor:         "default",
            userSelect:     "none",
        }}>
            <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
            <div style={{
                fontFamily:    "'Bebas Neue',display",
                fontSize:      "1.05rem",
                letterSpacing: "0.08em",
                color:         data.color,
                lineHeight:    1,
                textAlign:     "center",
            }}>{data.label}</div>
            {data.description && (
                <div style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize:   "0.6rem",
                    color:      data.color + "99",
                    marginTop:  "4px",
                    textAlign:  "center",
                    lineHeight: 1.3,
                }}>{data.description}</div>
            )}
            <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
        </div>
    );
}

// ── Custom node: Topic ────────────────────────────────────────────────────────
function TopicNode({ data }) {
    const cfg = TYPE_CONFIG[data.type] ?? TYPE_CONFIG.required;
    const [hov, setHov] = useState(false);

    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                width:          PHASE_W + "px",
                minHeight:      TOPIC_H + "px",
                borderRadius:   "8px",
                border:         "1.5px solid " + (hov ? data.color + "99" : data.color + "33"),
                background:     hov ? data.color + "18" : data.cardBg,
                display:        "flex",
                flexDirection:  "column",
                justifyContent: "center",
                padding:        "10px 14px",
                transition:     "all 0.15s ease",
                boxShadow:      hov ? "0 4px 20px " + data.color + "33" : "none",
                cursor:         "default",
                userSelect:     "none",
                position:       "relative",
                boxSizing:      "border-box",
            }}
        >
            <Handle type="target" position={Position.Top}    style={{ opacity: 0, left: "50%" }} />
            <Handle type="source" position={Position.Bottom} style={{ opacity: 0, left: "50%" }} />
            <Handle type="source" position={Position.Right}  style={{ opacity: 0 }} />

            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px" }}>
                <div style={{
                    width:        "6px",
                    height:       "6px",
                    borderRadius: "50%",
                    background:   cfg.dot,
                    flexShrink:   0,
                    boxShadow:    hov ? "0 0 6px " + cfg.dot : "none",
                }} />
                <span style={{
                    fontFamily:    "'Plus Jakarta Sans',sans-serif",
                    fontSize:      "0.78rem",
                    fontWeight:    700,
                    color:         hov ? data.color : data.textColor,
                    lineHeight:    1.2,
                    letterSpacing: "0.01em",
                }}>{data.label}</span>
            </div>

            {data.description && (
                <div style={{
                    fontFamily:      "'Plus Jakarta Sans',sans-serif",
                    fontSize:        "0.6rem",
                    color:           data.subColor,
                    lineHeight:      1.45,
                    overflow:        "hidden",
                    display:         "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                }}>{data.description}</div>
            )}
        </div>
    );
}

const NODE_TYPES = { phase: PhaseNode, topic: TopicNode };

// ── Build nodes + edges from API response ─────────────────────────────────────
function buildGraph(roadmap, catColor, th) {
    if (!roadmap?.phases?.length) return { nodes: [], edges: [] };

    const nodes = [];
    const edges = [];

    roadmap.phases.forEach((phase, pIdx) => {
        const x = pIdx * (PHASE_W + PHASE_GAP);

        nodes.push({
            id:       "phase_" + phase.id,
            type:     "phase",
            position: { x, y: 0 },
            data: {
                label:       phase.label,
                description: phase.description,
                color:       catColor,
            },
            draggable: true,
        });

        (phase.topics ?? []).forEach((topic, tIdx) => {
            const y = TOPIC_TOP + tIdx * (TOPIC_H + TOPIC_GAP);

            nodes.push({
                id:       topic.id,
                type:     "topic",
                position: { x, y },
                data: {
                    label:       topic.label,
                    description: topic.description,
                    type:        topic.type,
                    color:       catColor,
                    cardBg:      th.card,
                    textColor:   th.text,
                    subColor:    th.sub,
                },
                draggable: true,
            });

            // Phase header → first topic
            if (tIdx === 0) {
                edges.push({
                    id:        "e_phase_" + phase.id + "_" + topic.id,
                    source:    "phase_" + phase.id,
                    target:    topic.id,
                    type:      "smoothstep",
                    animated:  false,
                    style:     { stroke: catColor + "44", strokeWidth: 1.5 },
                    markerEnd: { type: MarkerType.ArrowClosed, color: catColor + "44" },
                });
            }

            // Topic → next topic within same phase
            const nextTopic = phase.topics[tIdx + 1];
            if (nextTopic) {
                edges.push({
                    id:        "e_seq_" + topic.id + "_" + nextTopic.id,
                    source:    topic.id,
                    target:    nextTopic.id,
                    type:      "smoothstep",
                    animated:  false,
                    style:     { stroke: catColor + "44", strokeWidth: 1.5 },
                    markerEnd: { type: MarkerType.ArrowClosed, color: catColor + "44" },
                });
            }
        });

        // Last topic → next phase header
        const nextPhase = roadmap.phases[pIdx + 1];
        if (nextPhase && phase.topics?.length) {
            const lastTopic = phase.topics[phase.topics.length - 1];
            edges.push({
                id:        "e_next_phase_" + phase.id + "_" + nextPhase.id,
                source:    lastTopic.id,
                target:    "phase_" + nextPhase.id,
                type:      "smoothstep",
                animated:  false,
                style:     { stroke: catColor + "66", strokeWidth: 1.5 },
                markerEnd: { type: MarkerType.ArrowClosed, color: catColor + "66" },
            });
        }
    });

    return { nodes, edges };
}

// ── Loading animation ─────────────────────────────────────────────────────────
function RoadmapLoading({ lang, color, th }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "18px", background: th.bg }}>
            <div style={{
                fontFamily:           "'Bebas Neue',display",
                fontSize:             "1.6rem",
                letterSpacing:        "0.1em",
                background:           "linear-gradient(135deg," + color + ",#FFA94D)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor:  "transparent",
            }}>
                GENERATING {lang.toUpperCase()} ROADMAP…
            </div>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.8rem", color: th.dim }}>
                Powered by Claude AI
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
                {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                        width:          "8px",
                        height:         "8px",
                        borderRadius:   "50%",
                        background:     color,
                        animation:      "rmDot 1.2s ease-in-out infinite",
                        animationDelay: (i * 0.15) + "s",
                        opacity:        0.3,
                    }} />
                ))}
            </div>
            <style>{`@keyframes rmDot { 0%,80%,100%{opacity:.3;transform:scale(1)} 40%{opacity:1;transform:scale(1.4)} }`}</style>
        </div>
    );
}

// ── Main modal ────────────────────────────────────────────────────────────────
export default function RoadmapModal({ lang, roadmap, loading, error, onClose, T }) {
    const th    = T || { bg: "#0B0F19", card: "#111827", border: "#1F2937", text: "#F9FAFB", sub: "#9CA3AF", dim: "#6B7280" };
    const cat   = CATEGORIES[lang.cat];
    const color = cat?.color ?? "#FF7A00";

    const [rfNodes, setRfNodes] = useNodesState([]);
    const [rfEdges, setRfEdges] = useEdgesState([]);

    useEffect(() => {
        if (roadmap) {
            const { nodes: n, edges: e } = buildGraph(roadmap, color, th);
            setRfNodes(n);
            setRfEdges(e);
        }
    }, [roadmap, color, th.card]);

    useEffect(() => {
        const fn = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", fn);
        return () => window.removeEventListener("keydown", fn);
    }, [onClose]);

    const legend = Object.entries(TYPE_CONFIG).map(([k, v]) => ({ key: k, ...v }));

    return (
        <div style={{
            position:       "fixed",
            inset:          0,
            zIndex:         100,
            background:     th.bg + "F5",
            backdropFilter: "blur(8px)",
            display:        "flex",
            flexDirection:  "column",
        }}>
            <style>{flowOverride(th)}</style>

            {/* Header */}
            <div style={{
                height:       "56px",
                flexShrink:   0,
                display:      "flex",
                alignItems:   "center",
                padding:      "0 20px",
                gap:          "14px",
                borderBottom: "1px solid " + th.border,
                background:   th.card + "EE",
            }}>
                <div style={{
                    display:      "flex",
                    alignItems:   "center",
                    gap:          "8px",
                    border:       "1px solid " + color + "55",
                    borderRadius: "8px",
                    padding:      "4px 12px",
                    background:   color + "12",
                }}>
                    <span style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.1rem", color, letterSpacing: "0.06em" }}>
                        {lang.sym}
                    </span>
                    <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.82rem", fontWeight: 700, color: th.text }}>
                        {lang.name}
                    </span>
                    <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.68rem", color: th.dim }}>
                        Roadmap
                    </span>
                </div>

                <div style={{ flex: 1 }} />

                {!loading && roadmap && (
                    <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                        {legend.map(l => (
                            <div key={l.key} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: l.dot }} />
                                <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.67rem", color: th.sub }}>
                                    {l.label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{
                    display:      "flex",
                    alignItems:   "center",
                    gap:          "5px",
                    padding:      "4px 10px",
                    borderRadius: "6px",
                    border:       "1px solid #FF7A0033",
                    background:   "#FF7A0010",
                }}>
                    <span style={{ fontSize: "0.65rem", color: "#FF7A00", fontFamily: "'JetBrains Mono',monospace" }}>
                        ✦ Claude AI
                    </span>
                </div>

                <button
                    onClick={onClose}
                    style={{
                        width:          "32px",
                        height:         "32px",
                        borderRadius:   "50%",
                        border:         "1px solid " + th.border,
                        background:     th.card,
                        color:          th.sub,
                        cursor:         "pointer",
                        fontSize:       "1rem",
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "center",
                        flexShrink:     0,
                    }}
                >✕</button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, position: "relative" }}>
                {loading && <RoadmapLoading lang={lang.name} color={color} th={th} />}

                {error && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "12px", background: th.bg }}>
                        <div style={{ fontSize: "2rem" }}>⚠️</div>
                        <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.2rem", color: "#f87171", letterSpacing: "0.06em" }}>
                            FAILED TO GENERATE ROADMAP
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.72rem", color: th.dim }}>{error}</div>
                    </div>
                )}

                {!loading && !error && roadmap && (
                    <ReactFlow
                        nodes={rfNodes}
                        edges={rfEdges}
                        onNodesChange={() => {}}
                        onEdgesChange={() => {}}
                        nodeTypes={NODE_TYPES}
                        fitView
                        fitViewOptions={{ padding: 0.12 }}
                        minZoom={0.2}
                        maxZoom={2}
                        style={{ background: th.bg }}
                        proOptions={{ hideAttribution: true }}
                    >
                        <Background color={th.border} gap={24} size={1} />
                        <Controls />
                    </ReactFlow>
                )}
            </div>
        </div>
    );
}