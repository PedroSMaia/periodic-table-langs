import { useState, useEffect, useCallback, useRef } from "react";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const TOKEN_KEY = "ptl-token";

export function useAuth() {
    const [user, setUser]       = useState(null);
    const [token, setTokenS]    = useState(() => localStorage.getItem(TOKEN_KEY));
    const [loading, setLoading] = useState(!!localStorage.getItem(TOKEN_KEY));
    const tokenRef = useRef(token);

    const setToken = (t) => {
        tokenRef.current = t;
        setTokenS(t);
        if (t) localStorage.setItem(TOKEN_KEY, t);
        else   localStorage.removeItem(TOKEN_KEY);
    };

    const authFetch = useCallback(async (path, opts = {}) => {
        const headers = { "Content-Type": "application/json", ...opts.headers };
        if (tokenRef.current) headers["Authorization"] = `Bearer ${tokenRef.current}`;
        const res = await fetch(`${BASE}/api${path}`, { ...opts, headers });
        return res;
    }, []);

    // Validate session on mount
    useEffect(() => {
        if (!token) { setLoading(false); return; }
        let cancelled = false;
        (async () => {
            try {
                const res = await authFetch("/auth/me");
                if (!res.ok) throw new Error();
                const data = await res.json();
                if (!cancelled) setUser(data.user);
            } catch {
                if (!cancelled) { setToken(null); setUser(null); }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const clearProgressCache = () => {
        Object.keys(localStorage)
            .filter(k => k.startsWith('ptl_progress_') || k.startsWith('ptl_path_'))
            .forEach(k => localStorage.removeItem(k));
    };

    const login = useCallback(async (email, password) => {
        const res = await authFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.errors?.email?.[0] || "Login failed");
        setToken(data.token);
        setUser(data.user);
        return data.user;
    }, [authFetch]);

    const register = useCallback(async (name, email, password) => {
        const res = await authFetch("/auth/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
            const msg = data.message || Object.values(data.errors || {}).flat()[0] || "Registration failed";
            throw new Error(msg);
        }
        clearProgressCache();
        setToken(data.token);
        setUser(data.user);
        return data.user;
    }, [authFetch]);

    const logout = useCallback(async () => {
        try { await authFetch("/auth/logout", { method: "POST" }); } catch { /* ignore */ }
        clearProgressCache();
        setToken(null);
        setUser(null);
    }, [authFetch]);

    return { user, token, loading, login, register, logout, authFetch };
}
