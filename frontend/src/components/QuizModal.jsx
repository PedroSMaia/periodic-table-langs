import { useState, useMemo } from "react";
import { LANGS, CATEGORIES } from "../data/index.js";

/**
 * Quiz question definitions.
 *
 * Each question has:
 * - id:      unique key
 * - q:       question text
 * - emoji:   decorative emoji shown above the question
 * - opts:    fixed list of answer options (used when allOpts is absent)
 * - allOpts: full list of options that gets filtered by the answer to Q1 (goal)
 *
 * Each option has:
 * - id:    unique key
 * - label: display text
 * - w:     weight map { languageName: points } — used by scoreQuiz to rank results
 * - goals: (allOpts only) which goal answers should include this option
 */
const QUIZ = [
    { id: "goal", q: "What do you want to build?", emoji: "🎯", opts: [
            { id: "web",     label: "🌐 Web / APIs / SaaS",    w: { JavaScript: 10, TypeScript: 9, Python: 7, PHP: 6, Ruby: 5, Go: 5, Elixir: 4 } },
            { id: "mobile",  label: "📱 Mobile Apps",           w: { Kotlin: 10, Swift: 10, Dart: 9, JavaScript: 5, Java: 4 } },
            { id: "games",   label: "🎮 Games / Game Dev",      w: { "C++": 10, "C#": 9, Lua: 7, Python: 5, Rust: 4 } },
            { id: "ai",      label: "🤖 AI / Data Science",     w: { Python: 10, R: 8, Julia: 7, MATLAB: 5, Scala: 4 } },
            { id: "systems", label: "⚙️ Systems / Embedded",   w: { Rust: 10, C: 10, "C++": 8, Zig: 7, Go: 5, Ada: 3 } },
            { id: "scripts", label: "🔧 Scripts / Automation",  w: { Python: 9, Bash: 8, PowerShell: 6, Ruby: 5 } },
        ]},
    { id: "level", q: "What's your current level?", emoji: "📊", opts: [
            { id: "beginner",     label: "🐣 Beginner — first language",         w: { Python: 5, JavaScript: 4, Ruby: 3 } },
            { id: "intermediate", label: "📚 Intermediate — I know one language", w: { TypeScript: 4, Kotlin: 4, Go: 4, Swift: 3, "C#": 2, Rust: 2 } },
            { id: "advanced",     label: "🚀 Advanced — I want to expand",        w: { Rust: 5, Haskell: 5, C: 4, "C++": 3, OCaml: 4 } },
        ]},
    { id: "priority", q: "What matters most to you?", emoji: "⚡", opts: [
            { id: "jobs",         label: "💼 Get a job quickly",           w: { Python: 5, JavaScript: 5, TypeScript: 4, Java: 4, "C#": 4, Go: 3, SQL: 3 } },
            { id: "fundamentals", label: "🧠 Learn the fundamentals",      w: { C: 5, Haskell: 4, Lisp: 3, Scheme: 3, Assembly: 2 } },
            { id: "performance",  label: "🔥 Maximum performance",         w: { Rust: 5, C: 5, "C++": 4, Zig: 4, Assembly: 3 } },
            { id: "productivity", label: "😊 Productivity / Developer XP", w: { Python: 5, Ruby: 4, JavaScript: 3, Go: 3, Elixir: 3 } },
        ]},
    { id: "typing", q: "Do you prefer code...", emoji: "✍️", opts: [
            { id: "typed",   label: "🔒 Typed — errors caught early", w: { TypeScript: 4, Rust: 4, Kotlin: 4, Swift: 4, Haskell: 4, "C#": 3 } },
            { id: "dynamic", label: "🌊 Dynamic — write fast",        w: { Python: 4, JavaScript: 4, Ruby: 5, Lua: 3, PHP: 3, Elixir: 3 } },
            { id: "either",  label: "🤷 Either works",                w: { Go: 3, Python: 2, JavaScript: 2 } },
        ]},
    { id: "platform", q: "Where will your code run?", emoji: "🖥️", allOpts: [
            { id: "browser",  label: "🌍 Browser / Frontend",        goals: ["web"],                           w: { JavaScript: 8, TypeScript: 8, Elm: 4 } },
            { id: "backend",  label: "🔬 Backend / APIs",            goals: ["web", "ai", "scripts", "systems"], w: { Go: 7, Python: 6, Java: 5, Rust: 5, PHP: 4, Ruby: 4, Elixir: 5, "C#": 4, Kotlin: 4 } },
            { id: "mobile2",  label: "📱 iOS / Android",             goals: ["mobile"],                        w: { Swift: 8, Kotlin: 8, Dart: 7 } },
            { id: "desktop",  label: "💻 Desktop",                   goals: ["games", "ai", "scripts"],        w: { "C#": 7, Java: 5, "C++": 5, Python: 4, Rust: 4 } },
            { id: "hardware", label: "🔌 Hardware / Embedded",       goals: ["systems"],                       w: { C: 8, "C++": 7, Rust: 6, Zig: 5, Assembly: 4, Ada: 4 } },
            { id: "anywhere", label: "⚡ Anywhere / Cross-platform", goals: ["games", "mobile", "scripts"],    w: { Python: 5, JavaScript: 4, Kotlin: 4, Dart: 4, Lua: 3 } },
        ]},
];

/**
 * Aggregates answer weights into a ranked list of language recommendations.
 *
 * Each answer option carries a weight map { languageName: points }.
 * We sum all points across all answers, then return the top 5 as
 * { lang, pct } objects where pct is relative to the highest scorer.
 *
 * @param {Array} answers - Array of selected option objects (one per question)
 * @returns {Array} - Top 5 results: [{ lang: LangObject, pct: number }]
 */
function scoreQuiz(answers) {
    const scores = {};
    answers.forEach(opt => {
        if (!opt?.w) return;
        Object.entries(opt.w).forEach(([lang, pts]) => {
            scores[lang] = (scores[lang] || 0) + pts;
        });
    });
    const max = Math.max(...Object.values(scores), 1);
    return Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, pts]) => ({
            lang: LANGS.find(l => l.name === name),
            pct:  Math.round((pts / max) * 100),
        }))
        .filter(x => x.lang); // drop any names not found in LANGS
}

/**
 * Multi-step quiz modal that recommends languages based on the user's answers.
 *
 * Flow:
 * 1. User answers 5 questions (goal → level → priority → typing → platform)
 * 2. scoreQuiz() aggregates the weights into a ranked list
 * 3. Results screen shows top 5 with match % bars
 * 4. "View in table" highlights those languages on the grid and closes the modal
 *
 * Props:
 * @param {function} onClose     - Called to close the modal
 * @param {function} onHighlight - Called with an array of lang IDs to highlight on the grid
 * @param {object}   T           - Theme tokens
 */
export default function QuizModal({ onClose, onHighlight, T }) {
    const th = T || { card: "#111827", border: "#1F2937", bg: "#0B0F19", text: "#F9FAFB", sub: "#9CA3AF", dim: "#6B7280" };

    // Use a slightly lighter overlay in light mode so it doesn't look washed out
    const overlayBg = T?.bg === "#FFFFFF" ? "rgba(15,23,42,0.85)" : "rgba(11,15,25,0.88)";

    const [step,    setStep]    = useState(0);
    const [answers, setAnswers] = useState([]);
    const [results, setResults] = useState(null);

    // The answer to Q1 (goal) is used to filter options in the last question (platform)
    const goalAnswer = answers[0];

    /**
     * Compute the current question's options.
     * For the "platform" question, filter allOpts to those relevant to the chosen goal.
     * If fewer than 2 options match, fall back to showing all options.
     */
    const q = useMemo(() => {
        const base = QUIZ[step];
        if (base.allOpts && goalAnswer) {
            const filtered = base.allOpts.filter(o => o.goals.includes(goalAnswer.id));
            return { ...base, opts: filtered.length >= 2 ? filtered : base.allOpts };
        }
        return { ...base, opts: base.opts || base.allOpts };
    }, [step, goalAnswer]);

    // Record the chosen option and advance to the next step (or show results)
    const pick = (opt) => {
        const a = [...answers, opt];
        if (step < QUIZ.length - 1) {
            setAnswers(a);
            setStep(step + 1);
        } else {
            setResults(scoreQuiz(a));
        }
    };

    // Reset the quiz to the beginning
    const reset = () => { setStep(0); setAnswers([]); setResults(null); };

    const medals = ["🥇", "🥈", "🥉", "4.", "5."];

    return (
        <div style={{ position: "fixed", inset: 0, background: overlayBg, backdropFilter: "blur(7px)", zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div style={{ background: th.card, border: "1px solid " + th.border, borderRadius: "16px", width: "100%", maxWidth: "540px", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>

                {/* Progress bar — fills proportionally as the user advances through questions */}
                <div style={{ height: "3px", background: "linear-gradient(90deg,#FF7A00,#FFA94D)", transform: "scaleX(" + (results ? 1 : (step + 1) / QUIZ.length) + ")", transformOrigin: "left", transition: "transform .4s ease" }} />

                <div style={{ padding: "24px 28px 28px" }}>
                    {!results ? (
                        // ── QUESTION SCREEN ──
                        <>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.68rem", color: th.dim, letterSpacing: "0.1em", fontWeight: 700 }}>
                  QUESTION {step + 1} / {QUIZ.length}
                </span>
                                <button onClick={onClose} style={{ background: th.bg, border: "1px solid " + th.border, borderRadius: "50%", width: "28px", height: "28px", color: th.sub, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <div style={{ fontSize: "2rem", marginBottom: "6px" }}>{q.emoji}</div>
                                <h2 style={{ margin: 0, fontFamily: "'Bebas Neue',display", fontSize: "1.8rem", letterSpacing: "0.04em", color: th.text }}>{q.q}</h2>
                            </div>

                            {/* Answer option buttons */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                {q.opts.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => pick(opt)}
                                        style={{ padding: "11px 15px", borderRadius: "9px", border: "1px solid " + th.border, background: th.bg, color: th.sub, cursor: "pointer", textAlign: "left", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.88rem", fontWeight: 500, transition: "all .14s" }}
                                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,122,0,0.08)"; e.currentTarget.style.borderColor = "#FF7A00"; e.currentTarget.style.color = th.text; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = th.bg; e.currentTarget.style.borderColor = th.border; e.currentTarget.style.color = th.sub; }}
                                    >{opt.label}</button>
                                ))}
                            </div>

                            {/* Back button — only shown after the first question */}
                            {step > 0 && (
                                <button
                                    onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)); }}
                                    style={{ marginTop: "12px", background: "none", border: "none", color: th.dim, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.76rem" }}
                                >← Back</button>
                            )}
                        </>
                    ) : (
                        // ── RESULTS SCREEN ──
                        <>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                <h2 style={{ margin: 0, fontFamily: "'Bebas Neue',display", fontSize: "1.7rem", letterSpacing: "0.05em", background: "linear-gradient(135deg,#FF7A00,#FFA94D)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                    Your ideal languages
                                </h2>
                                <button onClick={onClose} style={{ background: th.bg, border: "1px solid " + th.border, borderRadius: "50%", width: "28px", height: "28px", color: th.sub, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                            </div>

                            {/* Ranked result cards */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "9px", marginBottom: "18px" }}>
                                {results.map(({ lang, pct }, i) => {
                                    const cat = CATEGORIES[lang.cat];
                                    return (
                                        <div key={lang.id} style={{ display: "flex", alignItems: "center", gap: "11px", padding: "11px 13px", borderRadius: "9px", border: "1px solid " + cat.color + "33", background: cat.bg }}>
                                            <span style={{ fontSize: "1.2rem", minWidth: "24px" }}>{medals[i]}</span>

                                            {/* Mini language badge */}
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", border: "1.5px solid " + cat.color, borderRadius: "5px", padding: "3px 8px", background: th.bg, minWidth: "44px" }}>
                                                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.48rem", color: cat.color, fontWeight: 600 }}>{String(lang.id).padStart(2, "0")}</span>
                                                <span style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.3rem", color: cat.color, lineHeight: 1 }}>{lang.sym}</span>
                                            </div>

                                            {/* Name + match % bar */}
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: "0.92rem", color: th.text, marginBottom: "4px" }}>{lang.name}</div>
                                                <div style={{ height: "4px", background: th.border, borderRadius: "2px", overflow: "hidden" }}>
                                                    <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg," + cat.color + "," + cat.color + "88)", borderRadius: "2px" }} />
                                                </div>
                                                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.6rem", color: cat.color, marginTop: "2px" }}>{pct}% match</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Action buttons */}
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                    onClick={() => { onHighlight(results.map(r => r.lang.id)); onClose(); }}
                                    style={{ flex: 1, padding: "11px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg,#FF7A00,#E86600)", color: "white", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.04em" }}
                                >View in table →</button>
                                <button
                                    onClick={reset}
                                    style={{ padding: "11px 15px", borderRadius: "8px", border: "1px solid " + th.border, background: th.bg, color: th.sub, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, fontSize: "0.82rem" }}
                                >Retry</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}