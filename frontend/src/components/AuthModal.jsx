import { useState } from "react";

export default function AuthModal({ T, onClose, onLogin, onRegister }) {
    const [tab, setTab]           = useState("login");
    const [name, setName]         = useState("");
    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [error, setError]       = useState(null);
    const [busy, setBusy]         = useState(false);

    const th = T;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setBusy(true);
        try {
            if (tab === "login") await onLogin(email, password);
            else                 await onRegister(name, email, password);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    };

    const inputStyle = {
        width: "100%", padding: "10px 14px", borderRadius: "8px",
        border: "1px solid " + th.border, background: th.bg, color: th.text,
        fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.85rem", outline: "none",
        boxSizing: "border-box",
    };

    const tabBtn = (id, label) => (
        <button
            type="button"
            onClick={() => { setTab(id); setError(null); }}
            style={{
                flex: 1, padding: "8px", borderRadius: "6px", border: "none", cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: "0.78rem",
                letterSpacing: "0.04em", transition: "all .15s",
                background: tab === id ? th.border : "transparent",
                color: tab === id ? th.text : th.dim,
            }}
        >{label}</button>
    );

    return (
        <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 120, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "380px", margin: "0 16px", background: th.card, border: "1px solid " + th.border, borderRadius: "14px", padding: "28px 24px 24px", position: "relative" }}>

                {/* Close */}
                <button onClick={onClose} style={{ position: "absolute", top: "12px", right: "12px", width: "28px", height: "28px", borderRadius: "50%", border: "1px solid " + th.border, background: "transparent", color: th.dim, cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>

                {/* Title */}
                <div style={{ fontFamily: "'Bebas Neue',display", fontSize: "1.3rem", letterSpacing: "0.08em", background: "linear-gradient(135deg,#FF7A00,#FFA94D)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "18px", textAlign: "center" }}>
                    ACCOUNT
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: "4px", marginBottom: "18px", background: th.bg, borderRadius: "8px", padding: "3px" }}>
                    {tabBtn("login", "Login")}
                    {tabBtn("register", "Register")}
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {tab === "register" && (
                        <input
                            type="text" placeholder="Name" required value={name}
                            onChange={e => setName(e.target.value)} style={inputStyle}
                        />
                    )}
                    <input
                        type="email" placeholder="Email" required value={email}
                        onChange={e => setEmail(e.target.value)} style={inputStyle}
                    />
                    <input
                        type="password" placeholder="Password" required minLength={6}
                        value={password} onChange={e => setPassword(e.target.value)} style={inputStyle}
                    />

                    {error && (
                        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.75rem", color: "#f87171", padding: "6px 10px", borderRadius: "6px", border: "1px solid rgba(248,113,113,0.25)", background: "rgba(248,113,113,0.08)" }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit" disabled={busy}
                        style={{
                            width: "100%", padding: "10px", borderRadius: "8px", border: "none", cursor: busy ? "wait" : "pointer",
                            fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: "0.85rem",
                            letterSpacing: "0.04em", transition: "all .15s",
                            background: "linear-gradient(135deg,#FF7A00,#FFA94D)", color: "#fff",
                            opacity: busy ? 0.6 : 1,
                        }}
                    >
                        {busy ? "Please wait…" : tab === "login" ? "Login" : "Create account"}
                    </button>
                </form>
            </div>
        </div>
    );
}
