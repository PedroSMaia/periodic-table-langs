import { useState, useEffect, useRef } from "react";
import { CATEGORIES } from "../data/index.js";
import { TIOBE, SO_LOVED, SO_USED } from "../data/metrics.js";
import { deviconUrl } from "../data/devicons.js";
import { GITHUB_REPO } from "../utils/constants.js";

/**
 * Slide-in panel showing full details for a selected language.
 *
 * On desktop: slides in from the right (translateX)
 * On mobile:  slides up from the bottom (translateY), supports swipe-down to close
 *
 * Props:
 * @param {object}   lang           - Language object from LANGS
 * @param {function} onClose        - Called when the panel should close
 * @param {boolean}  isMobile       - Whether the viewport is mobile-sized
 * @param {function} onAddToCompare - Called to add this lang to the compare list
 * @param {boolean}  inCompare      - Whether this lang is already in the compare list
 * @param {boolean}  canCompare     - Whether more langs can be added to compare (max not reached)
 * @param {object}   T              - Theme tokens
 */
export default function DetailPanel({ lang, onClose, isMobile, onAddToCompare, inCompare, canCompare, T }) {
    // Controls the CSS transition — panel starts hidden, mounts after 12ms to trigger animation
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);

    // Used to detect swipe-down gesture on mobile
    const touchStartY = useRef(null);

    const c  = CATEGORIES[lang.cat];
    const th = T || { card: "#111827", border: "#1F2937", bg: "#0B0F19" };

    // Trigger the slide-in animation shortly after mount
    // Also re-runs when lang changes so the panel re-animates when switching languages
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 12);
        return () => clearTimeout(t);
    }, [lang]);

    // Animate out before calling onClose so the transition plays before unmounting
    const close = () => {
        setMounted(false);
        setTimeout(onClose, 300);
    };

    // Copy a shareable URL for this language to the clipboard
    const share = () => {
        const url = window.location.origin + window.location.pathname + "?lang=" + encodeURIComponent(lang.name);
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    // Swipe-down-to-close: record the Y position on touch start
    const onTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
    // If the finger moved down more than 60px, treat it as a close gesture
    const onTouchEnd = (e) => {
        if (touchStartY.current === null) return;
        const delta = e.changedTouches[0].clientY - touchStartY.current;
        if (delta > 60) close();
        touchStartY.current = null;
    };

    // Build the "Reference" links section from known link keys
    const referenceLinks = [
        lang.links?.official && { href: lang.links.official, label: "Official Site",    icon: "🌐" },
        lang.links?.wiki     && { href: lang.links.wiki,     label: "Wikipedia",        icon: "📖" },
        lang.links?.docs     && { href: lang.links.docs,     label: "Documentation",    icon: "📚" },
        lang.links?.spec     && { href: lang.links.spec,     label: "Language Spec",    icon: "📋" },
    ].filter(Boolean);

    // Labels that should display as-is (not replaced by hostname)
    const FIXED_LABELS = ["Official Site", "Wikipedia", "Documentation", "Language Spec", "GitHub Repository", "Community / Reddit", "Try it online"];

    /**
     * A single link row used in all link sections.
     * If the label is not in FIXED_LABELS, it falls back to the hostname of the URL.
     */
    const Row = ({ href, label, icon, desc }) => {
        const [h, setH] = useState(false);
        let lbl = label;
        try {
            if (!FIXED_LABELS.includes(label)) {
                lbl = new URL(href).hostname.replace("www.", "");
            }
        } catch {}

        return (
            <div>
                <a
                    href={href} target="_blank" rel="noopener noreferrer"
                    onMouseEnter={() => setH(true)}
                    onMouseLeave={() => setH(false)}
                    style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "8px 13px", borderRadius: "8px",
                        border: "1px solid " + (h ? c.color : th.border),
                        background: h ? c.bg : th.card,
                        color: h ? th.text : th.sub,
                        textDecoration: "none",
                        fontSize: "0.79rem", fontFamily: "'Plus Jakarta Sans',sans-serif",
                        transition: "all .14s",
                    }}
                >
                    <span>{icon}</span>
                    <span style={{ flex: 1 }}>{lbl}</span>
                    <span style={{ opacity: .4, fontSize: ".66rem", color: th.dim }}>↗</span>
                </a>
                {desc && (
                    <div style={{ fontSize: "0.6rem", color: th.dim, paddingLeft: "31px", marginTop: "1px", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                        {desc}
                    </div>
                )}
            </div>
        );
    };

    /**
     * Section label — small uppercase heading used throughout the scrollable body.
     */
    const SectionLabel = ({ children }) => (
        <div style={{ fontSize: "0.57rem", letterSpacing: "0.12em", textTransform: "uppercase", color: th.dim, marginBottom: "7px", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700 }}>
            {children}
        </div>
    );

    return (
        <>
            {/* Backdrop overlay — clicking it closes the panel */}
            <div
                onClick={close}
                style={{
                    position: "absolute", inset: 0,
                    background: "rgba(11,15,25,0.7)", backdropFilter: "blur(3px)",
                    zIndex: 40,
                    opacity: mounted ? 1 : 0,
                    transition: "opacity .3s",
                }}
            />

            {/* Panel itself */}
            <div
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                style={{
                    position: "absolute", right: 0, top: 0, bottom: 0,
                    width: isMobile ? "100%" : "400px",
                    maxWidth: isMobile ? "100%" : "90%",
                    zIndex: 50,
                    // Desktop: slide from right. Mobile: slide from bottom.
                    transform: mounted
                        ? (isMobile ? "translateY(0)" : "translateX(0)")
                        : (isMobile ? "translateY(100%)" : "translateX(100%)"),
                    transition: "transform .32s cubic-bezier(.4,0,.2,1)",
                    display: "flex", flexDirection: "column",
                    background: th.card,
                    borderLeft: isMobile ? "none" : "1px solid " + th.border,
                    borderTop:  isMobile ? "1px solid " + th.border : "none",
                    overflow: "hidden",
                }}
            >
                {/* Mobile drag handle */}
                {isMobile && (
                    <div style={{ flexShrink: 0, display: "flex", justifyContent: "center", padding: "8px 0 4px", cursor: "pointer" }} onClick={close}>
                        <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: th.border }} />
                    </div>
                )}

                {/* ── FIXED HEADER ── */}
                <div style={{ flexShrink: 0, background: "linear-gradient(180deg," + th.card + " 80%," + th.card + "F0)", borderBottom: "1px solid " + th.border }}>

                    {/* Colored top accent line */}
                    <div style={{ height: "3px", background: "linear-gradient(90deg,transparent," + c.color + ",transparent)" }} />

                    <div style={{ padding: "22px 24px 16px", position: "relative" }}>

                        {/* Action buttons: Share, Compare, Close */}
                        <div style={{ position: "absolute", top: "16px", right: "16px", display: "flex", gap: "8px", alignItems: "center" }}>
                            <button
                                onClick={share}
                                title="Copy link"
                                style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid " + (copied ? c.color + "66" : th.border), background: copied ? c.color + "20" : th.card, color: copied ? c.color : th.sub, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.68rem", fontWeight: 600, transition: "all .14s" }}
                                onMouseEnter={e => { if (!copied) { e.currentTarget.style.background = th.border; e.currentTarget.style.color = th.text; } }}
                                onMouseLeave={e => { if (!copied) { e.currentTarget.style.background = th.card;   e.currentTarget.style.color = th.sub;  } }}
                            >{copied ? "✓ Copied" : "⎘ Share"}</button>

                            {onAddToCompare && (
                                <button
                                    onClick={() => onAddToCompare(lang)}
                                    title={inCompare ? "Already in compare" : "Add to Compare"}
                                    style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid " + (inCompare ? c.color + "66" : th.border), background: inCompare ? c.color + "20" : "transparent", color: inCompare ? c.color : th.sub, cursor: inCompare || !canCompare ? "default" : "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.68rem", fontWeight: 600, transition: "all .14s", opacity: !inCompare && !canCompare ? 0.35 : 1 }}
                                    onMouseEnter={e => { if (!inCompare && canCompare) { e.currentTarget.style.background = th.border; e.currentTarget.style.color = th.text; } }}
                                    onMouseLeave={e => { if (!inCompare && canCompare) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = th.sub; } }}
                                >{inCompare ? "⇄ Added" : "⇄ Compare"}</button>
                            )}

                            <button
                                onClick={close}
                                style={{ width: "30px", height: "30px", borderRadius: "50%", background: th.card, border: "1px solid " + th.border, color: th.sub, cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >✕</button>
                        </div>

                        {/* Language card badge — shows logo (devicon) or symbol fallback */}
                        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", border: "2px solid " + c.color, borderRadius: "10px", padding: "8px 16px 10px", background: c.bg, boxShadow: "0 0 30px " + c.bg.replace("18", "35"), marginBottom: "15px", minWidth: "80px" }}>
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.6rem", color: c.color, alignSelf: "flex-end", fontWeight: 600 }}>{String(lang.id).padStart(2, "0")}</span>
                            <LogoOrSym lang={lang} c={c} />
                            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.7rem", color: c.color, marginTop: "5px", opacity: .9 }}>{lang.name}</span>
                        </div>

                        {/* Language name */}
                        <h2 style={{ margin: "0 0 8px", fontFamily: "'Bebas Neue',display", fontSize: "1.9rem", letterSpacing: "0.05em", color: th.text }}>{lang.name}</h2>

                        {/* Pill badges: category / year / TIOBE rank */}
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            <span style={{ padding: "3px 11px", borderRadius: "99px", border: "1px solid " + c.color, color: c.color, background: c.bg, fontSize: "0.69rem", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600 }}>{c.label}</span>
                            {lang.year && <span style={{ padding: "3px 11px", borderRadius: "99px", border: "1px solid " + th.border, color: th.sub, fontSize: "0.69rem", fontFamily: "'JetBrains Mono',monospace" }}>since {lang.year}</span>}
                            {TIOBE[lang.name] && <span style={{ padding: "3px 11px", borderRadius: "99px", border: "1px solid #fbbf2444", color: "#fbbf24", background: "#fbbf2410", fontSize: "0.69rem", fontFamily: "'JetBrains Mono',monospace" }}>TIOBE #{TIOBE[lang.name]}</span>}
                        </div>

                        {lang.paradigm && <div style={{ marginTop: "6px", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.7rem", color: th.dim }}>{lang.paradigm}</div>}

                        {/* SO Loved / SO Used stats — only rendered when data exists */}
                        {(SO_LOVED[lang.name] != null || SO_USED[lang.name] != null) && (
                            <div style={{ display: "flex", gap: "8px", marginTop: "11px" }}>
                                {SO_LOVED[lang.name] != null && (
                                    <div style={{ flex: 1, padding: "6px 10px", borderRadius: "7px", background: th.card, border: "1px solid " + th.border }}>
                                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.58rem", color: th.dim, marginBottom: "2px" }}>❤️ SO Loved</div>
                                        <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.45rem", color: c.color }}>{SO_LOVED[lang.name]}%</div>
                                    </div>
                                )}
                                {SO_USED[lang.name] != null && (
                                    <div style={{ flex: 1, padding: "6px 10px", borderRadius: "7px", background: th.card, border: "1px solid " + th.border }}>
                                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.58rem", color: th.dim, marginBottom: "2px" }}>📊 SO Used</div>
                                        <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.45rem", color: c.color }}>{SO_USED[lang.name]}%</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── SCROLLABLE BODY ── */}
                <div style={{ padding: "16px 24px 28px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", background: th.bg }}>

                    {/* Description */}
                    <p style={{ margin: 0, fontSize: "0.85rem", lineHeight: 1.76, color: th.sub, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{lang.desc}</p>

                    {/* Strengths list */}
                    {lang.strengths?.length > 0 && (
                        <div>
                            <SectionLabel>Strengths</SectionLabel>
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                {lang.strengths.map((s, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.8rem", color: th.sub, fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1.5 }}>
                                        <span style={{ color: c.color, fontWeight: 700, flexShrink: 0, marginTop: "1px" }}>→</span>
                                        <span>{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reference links (official, wiki, docs, spec) */}
                    {referenceLinks.length > 0 && (
                        <div>
                            <SectionLabel>Reference</SectionLabel>
                            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                {referenceLinks.map((l, i) => <Row key={i} {...l} />)}
                            </div>
                        </div>
                    )}

                    {/* Quick access links (playground, github, reddit) */}
                    {(lang.links?.playground || lang.links?.github || lang.links?.reddit) && (
                        <div>
                            <SectionLabel>Quick Access</SectionLabel>
                            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                {lang.links?.playground && <Row href={lang.links.playground} label="Try it online"       icon="▶️" />}
                                {lang.links?.github     && <Row href={lang.links.github}     label="GitHub Repository"   icon="🐙" />}
                                {lang.links?.reddit     && <Row href={lang.links.reddit}     label="Community / Reddit"  icon="💬" />}
                            </div>
                        </div>
                    )}

                    {/* Tutorials */}
                    {lang.tutorials?.length > 0 && (
                        <div>
                            <SectionLabel>Learn</SectionLabel>
                            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                {lang.tutorials.map((t, i) => {
                                    const href  = typeof t === "string" ? t : t.url;
                                    const label = typeof t === "string" ? new URL(t).hostname.replace("www.", "") : t.name;
                                    return <Row key={i} href={href} label={label} icon="🎓" />;
                                })}
                            </div>
                        </div>
                    )}

                    {/* Frameworks & tools */}
                    {lang.frameworks?.length > 0 && (
                        <div>
                            <SectionLabel>Frameworks & Tools</SectionLabel>
                            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                {lang.frameworks.map((f, i) => {
                                    const href  = typeof f === "string" ? f : f.url;
                                    const label = typeof f === "string" ? new URL(f).hostname.replace("www.", "") : f.name;
                                    const desc  = typeof f === "object" && f.desc ? f.desc : null;
                                    return <Row key={i} href={href} label={label} icon="⚙️" desc={desc} />;
                                })}
                            </div>
                        </div>
                    )}

                    {/* Package manager */}
                    {lang.package_manager && (
                        <div>
                            <SectionLabel>Package Manager</SectionLabel>
                            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                <Row href={lang.package_manager.url} label={lang.package_manager.name} icon="📦" />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── FOOTER ── */}
                <div style={{ padding: "11px 24px", borderTop: "1px solid " + th.border, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    {/* Link to open a GitHub issue to suggest a missing link */}
                    <a
                        href={"https://github.com/" + GITHUB_REPO + "/issues/new?title=" + encodeURIComponent("[suggest] " + lang.name + ": add/fix link") + "&body=" + encodeURIComponent("**Language:** " + lang.name + "\n\n**Link type:** (official site / docs / tutorial / framework / other)\n\n**URL:** \n\n**Why it's useful:** ")}
                        target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: "5px", padding: "3px 9px", borderRadius: "6px", border: "1px solid " + th.border, background: "transparent", color: th.dim, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.62rem", textDecoration: "none", transition: "all .13s", flexShrink: 0, whiteSpace: "nowrap" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.color = c.color; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.color = th.dim; }}
                    >＋ Suggest a link</a>
                </div>
            </div>
        </>
    );
}

/**
 * Renders the devicon logo for a language with a graceful fallback to the symbol.
 * Extracted as a sub-component so it can have its own useState for image load state.
 */
function LogoOrSym({ lang, c }) {
    const [imgState, setImgState] = useState("loading"); // "loading" | "loaded" | "error"
    const logoUrl = deviconUrl(lang.name);

    // No devicon available — just show the symbol
    if (!logoUrl) {
        return <span style={{ fontFamily: "'Bebas Neue',display", fontSize: "4.4rem", color: c.color, lineHeight: 0.9, textShadow: "0 0 24px " + c.color }}>{lang.sym}</span>;
    }

    return (
        <div style={{ width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center", margin: "2px 0", position: "relative" }}>
            {/* Symbol shown while image loads */}
            {imgState !== "loaded" && (
                <span style={{ position: "absolute", fontFamily: "'Bebas Neue',display", fontSize: "2.8rem", color: c.color + "66", lineHeight: 1, transition: "opacity .2s" }}>{lang.sym}</span>
            )}
            <img
                src={logoUrl}
                onLoad={() => setImgState("loaded")}
                onError={() => setImgState("error")}
                style={{ width: "56px", height: "56px", objectFit: "contain", opacity: imgState === "loaded" ? 1 : 0, transition: "opacity .25s" }}
                alt={lang.name}
            />
            {/* Symbol shown if image fails to load */}
            {imgState === "error" && (
                <span style={{ position: "absolute", fontFamily: "'Bebas Neue',display", fontSize: "2.8rem", color: c.color, lineHeight: 1 }}>{lang.sym}</span>
            )}
        </div>
    );
}