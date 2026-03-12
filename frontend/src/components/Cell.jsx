import { useState, useEffect } from "react";
import { CATEGORIES } from "../data/index.js";

/**
 * A single language cell in the periodic table grid.
 *
 * Handles:
 * - Hover, active, compare, highlight, and keyboard-focus visual states
 * - Entrance animation (only on mount — does not re-trigger on state changes)
 * - Dynamic font sizing based on available card dimensions
 * - TIOBE rank badge and compare checkmark badge
 *
 * Props:
 * @param {object}   lang        - Language object from LANGS
 * @param {number}   gridRow     - CSS grid-row placement
 * @param {number}   gridCol     - CSS grid-column placement
 * @param {function} onClick     - Called when cell is clicked in normal mode
 * @param {boolean}  active      - Whether the detail panel is open for this lang
 * @param {string}   mode        - "normal" | "compare"
 * @param {boolean}  inCompare   - Whether this lang is in the compare list
 * @param {function} onCompare   - Called when cell is clicked in compare mode
 * @param {boolean}  highlighted - Whether this cell matches a search result
 * @param {boolean}  showPop     - Whether to show the TIOBE popularity rank badge
 * @param {number}   cardW       - Card width in px (computed by parent)
 * @param {number}   cellH       - Cell height in px (computed by parent)
 * @param {boolean}  hidden      - Whether to hide this cell (filtered out)
 * @param {boolean}  keyFocused  - Whether this cell has keyboard focus
 * @param {object}   T           - Theme tokens (card background, text colors)
 * @param {boolean}  isDesktop   - Whether the viewport is desktop-sized
 * @param {number}   animDelay   - Stagger delay in ms for the entrance animation
 */
export default function Cell({
                                 lang, gridRow, gridCol, onClick, active, mode, inCompare,
                                 onCompare, highlighted, showPop, cardW, cellH, hidden,
                                 keyFocused, T, isDesktop, animDelay, metrics = {},
                             }) {
    const [hov, setHov] = useState(false);

    // Track whether the entrance animation has already played.
    // Once didMount is true, we set animation to "none" so that theme
    // changes, filter updates, and hover states never re-trigger the animation.
    const [didMount, setDidMount] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setDidMount(true), (animDelay || 0) + 400);
        return () => clearTimeout(t);
    }, []);

    // Resolve category color from the CATEGORIES map
    const c = CATEGORIES[lang.cat];

    // "lit" = any state that should activate the highlighted visual treatment
    const lit = hov || active || inCompare || highlighted || keyFocused;

    // TIOBE rank for this language (undefined if not in top list)
    const tRank = metrics.tiobe?.[lang.name];

    // --- Dynamic font sizing based on card dimensions ---
    const pad      = Math.max(2, Math.round(Math.min(cardW, cellH) * 0.07));
    const idSize   = Math.max(6, Math.round(cellH * 0.11));
    const symLen   = lang.sym.length;
    // Wider symbols get a smaller font to avoid overflow
    const symSize  = Math.round(Math.min(cellH * 0.38, cardW / (symLen > 2 ? 2.0 : 1.5)));
    const nameSize = Math.max(6, Math.round(
        lang.name.length > 10 ? cellH * 0.09 :
            lang.name.length > 7  ? cellH * 0.10 :
                cellH * 0.11
    ));

    // --- Color tokens ---
    const ORANGE = "#FF7A00";
    const borderColor = lit ? c.color : (keyFocused ? c.color : ORANGE + "55");
    const bgColor     = inCompare || active
        ? c.color + "28"
        : hov || highlighted
            ? (T?.card || "#111827")
            : keyFocused
                ? c.color + "10"
                : (T?.card || "#111827");
    const textColor   = lit ? c.color : (T?.cellText || "rgba(255,255,255,0.82)");
    const idColor     = lit ? c.color : ORANGE + "88";

    return (
        <div
            onClick={() => mode === "compare" ? onCompare(lang) : onClick(lang)}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                gridRow,
                gridColumn: gridCol,
                display: hidden ? "none" : "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                userSelect: "none",
                width: "100%",
                height: "100%",
                // Only animate on first render; skip on subsequent re-renders
                animation: didMount ? "none" : `cellIn 0.35s ease both`,
                animationDelay: didMount ? "0ms" : (animDelay || 0) + "ms",
            }}
        >
            <div style={{
                width: cardW + "px",
                height: "100%",
                border: "2px solid " + borderColor,
                borderRadius: "8px",
                background: bgColor,
                display: "grid",
                // Three rows: id badge / symbol / name
                gridTemplateRows: (idSize + pad) + "px 1fr " + (nameSize + pad + 2) + "px",
                transform: hov && isDesktop ? "translateY(-3px)" : "scale(1)",
                zIndex: hov ? (isDesktop ? 30 : 1) : (active || inCompare) ? 20 : keyFocused ? 15 : 1,
                boxShadow: keyFocused
                    ? "0 0 0 2px " + c.color + ", 0 2px 14px " + c.color + "44"
                    : hov && isDesktop
                        ? "0 6px 24px " + c.color + "55, inset 0 0 0 1px " + c.color
                        : hov
                            ? "inset 0 0 0 1px " + c.color
                            : active || inCompare || highlighted
                                ? "0 2px 14px " + c.color + "33, inset 0 0 0 1px " + c.color + "33"
                                : "none",
                transition: "all 0.17s cubic-bezier(.34,1.5,.64,1)",
                overflow: "hidden",
                boxSizing: "border-box",
                position: "relative",
            }}>

                {/* Top row: left badge (rank or checkmark) + right id number */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: pad + "px " + pad + "px 0" }}>
                    {showPop && tRank ? (
                        // TIOBE rank badge — color-coded by tier
                        <span style={{
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: Math.max(5, idSize * 0.8) + "px",
                            fontWeight: 700,
                            lineHeight: 1,
                            color: tRank <= 5  ? "#fbbf24"
                                : tRank <= 20 ? "#94a3b8"
                                    : tRank <= 50 ? "#cd7f32"
                                        : c.color + "88",
                        }}>#{tRank}</span>
                    ) : mode === "compare" && inCompare ? (
                        // Checkmark badge when in compare mode and selected
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: Math.max(5, idSize * 0.8) + "px", fontWeight: 700, lineHeight: 1, color: c.color }}>✓</span>
                    ) : <span />}

                    {/* Language id number (zero-padded) */}
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: idSize + "px", fontWeight: 600, lineHeight: 1, color: idColor, letterSpacing: "0.02em" }}>
            {String(lang.id).padStart(2, "0")}
          </span>
                </div>

                {/* Middle row: element symbol (the big text) */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{
              fontFamily: "'Bebas Neue',display",
              fontSize: symSize + "px",
              color: textColor,
              lineHeight: 1,
              letterSpacing: "0.02em",
              textShadow: lit ? "0 0 " + Math.round(symSize * 0.5) + "px " + c.color + "88" : "none",
              transition: "all .15s",
          }}>
            {lang.sym}
          </span>
                </div>

                {/* Bottom row: language name */}
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 " + pad + "px " + pad + "px" }}>
          <span style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: nameSize + "px",
              fontWeight: 600,
              color: textColor,
              textAlign: "center",
              lineHeight: 1.15,
              maxWidth: "100%",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
          }}>
            {lang.name}
          </span>
                </div>

            </div>
        </div>
    );
}