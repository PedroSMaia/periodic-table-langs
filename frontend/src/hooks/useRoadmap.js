import { useState, useCallback, useRef } from "react";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const POLL_INTERVAL = 4000;
const SYNC_DEBOUNCE = 500;

export function useRoadmap(token) {
    const [roadmap,     setRoadmap]     = useState(null);
    const [loading,     setLoading]     = useState(false);
    const [error,       setError]       = useState(null);
    const [pathLoading, setPathLoading] = useState(false);
    const [pathError,   setPathError]   = useState(null);
    // Bumped after server progress is written to localStorage — consumers use this
    // as part of a React key to force remount of components that read localStorage.
    const [progressVersion, setProgressVersion] = useState(0);

    const cache      = useRef({});
    const pathCache  = useRef({});
    const pollTimer  = useRef(null);
    const pathTimers = useRef({});
    const syncTimer  = useRef(null);
    const tokenRef   = useRef(token);
    tokenRef.current = token;

    const stopPolling = () => {
        if (pollTimer.current) { clearInterval(pollTimer.current); pollTimer.current = null; }
    };

    // ── Sync helpers ──────────────────────────────────────────────────────────

    const apiFetch = (path, opts = {}) => {
        const headers = { "Content-Type": "application/json", ...opts.headers };
        if (tokenRef.current) headers["Authorization"] = `Bearer ${tokenRef.current}`;
        return fetch(`${BASE}/api${path}`, { ...opts, headers });
    };

    const loadProgressFromServer = useCallback(async (langName, generatedAt) => {
        if (!tokenRef.current || !langName) return null;
        try {
            const res = await apiFetch("/progress");
            if (!res.ok) return null;
            const data = await res.json();
            const entry = data[langName];
            if (!entry) return null;
            const topics = entry.completed_topics ?? [];
            localStorage.setItem(`ptl_progress_${langName}`, JSON.stringify(topics));
            // Write the gen key so RoadmapModal's loadProgress() doesn't invalidate
            if (generatedAt) {
                localStorage.setItem(`ptl_progress_gen_${langName}`, String(generatedAt));
            }
            if (entry.selected_path_id) {
                localStorage.setItem(`ptl_path_${langName}`, entry.selected_path_id);
            } else {
                localStorage.removeItem(`ptl_path_${langName}`);
            }
            setProgressVersion(v => v + 1);
            return entry;
        } catch { return null; }
    }, []);

    const reloadProgress = useCallback(async (langName, generatedAt) => {
        if (!langName) return;
        cache.current = {};
        pathCache.current = {};
        await loadProgressFromServer(langName, generatedAt);
    }, [loadProgressFromServer]);

    const syncProgressToServer = useCallback((langName) => {
        if (!tokenRef.current || !langName) return;
        if (syncTimer.current) clearTimeout(syncTimer.current);
        syncTimer.current = setTimeout(async () => {
            try {
                const completedRaw = localStorage.getItem(`ptl_progress_${langName}`);
                const completed    = completedRaw ? JSON.parse(completedRaw) : [];
                const pathId       = localStorage.getItem(`ptl_path_${langName}`) || null;
                await apiFetch("/progress", {
                    method: "POST",
                    body: JSON.stringify({
                        language:         langName,
                        completed_topics: completed,
                        selected_path_id: pathId,
                    }),
                });
            } catch { /* silent */ }
        }, SYNC_DEBOUNCE);
    }, []);

    // Flush any pending sync immediately (call before unmount / logout)
    const flushSync = useCallback((langName) => {
        if (!tokenRef.current || !langName) return;
        if (syncTimer.current) {
            clearTimeout(syncTimer.current);
            syncTimer.current = null;
        }
        const completedRaw = localStorage.getItem(`ptl_progress_${langName}`);
        const completed    = completedRaw ? JSON.parse(completedRaw) : [];
        const pathId       = localStorage.getItem(`ptl_path_${langName}`) || null;
        // Use sendBeacon for reliability on page close, fall back to fetch
        const body = JSON.stringify({ language: langName, completed_topics: completed, selected_path_id: pathId });
        const headers = { "Content-Type": "application/json" };
        if (tokenRef.current) headers["Authorization"] = `Bearer ${tokenRef.current}`;
        try {
            fetch(`${BASE}/api/progress`, { method: "POST", headers, body, keepalive: true });
        } catch { /* best effort */ }
    }, []);

    // ── Fetch roadmap ─────────────────────────────────────────────────────────

    const fetchRoadmap = useCallback(async (langName) => {
        if (!langName) return;

        if (cache.current[langName]) {
            setRoadmap(cache.current[langName]);
            setError(null);
            if (tokenRef.current) loadProgressFromServer(langName, cache.current[langName]?.generated_at);
            return;
        }

        setLoading(true);
        setError(null);
        setRoadmap(null);
        stopPolling();

        const doFetch = async () => {
            try {
                const res  = await fetch(`${BASE}/api/roadmap/${encodeURIComponent(langName)}`);
                const data = await res.json();

                if (res.status === 404) {
                    stopPolling();
                    setLoading(false);
                    setError('not_cached');
                    return;
                }

                if (!res.ok) throw new Error(`Server responded with ${res.status}`);

                if (data.status === 'failed') {
                    stopPolling();
                    setLoading(false);
                    setError('failed');
                    return;
                }

                if (data.status === 'generating') return;

                stopPolling();
                cache.current[langName] = data;
                setRoadmap(data);
                setLoading(false);

                if (tokenRef.current) loadProgressFromServer(langName, data.generated_at);
            } catch (err) {
                stopPolling();
                setLoading(false);
                setError(err.message || "Failed to load roadmap");
            }
        };

        await doFetch();
        if (!cache.current[langName]) {
            pollTimer.current = setInterval(doFetch, POLL_INTERVAL);
        }
    }, [loadProgressFromServer]);

    // ── Fetch path ────────────────────────────────────────────────────────────

    const fetchPath = useCallback(async (langName, pathId) => {
        if (!langName || !pathId) return null;

        const key = `${langName}:${pathId}`;
        if (pathCache.current[key]) return pathCache.current[key];

        setPathLoading(true);
        setPathError(null);

        const doFetch = async () => {
            try {
                const res  = await fetch(`${BASE}/api/roadmap/${encodeURIComponent(langName)}/path/${encodeURIComponent(pathId)}`);
                const data = await res.json();

                if (res.status === 404) {
                    if (pathTimers.current[key]) { clearInterval(pathTimers.current[key]); delete pathTimers.current[key]; }
                    setPathLoading(false);
                    setPathError('not_cached');
                    return null;
                }

                if (!res.ok) throw new Error(`Server responded with ${res.status}`);

                if (data.status === 'failed') {
                    if (pathTimers.current[key]) { clearInterval(pathTimers.current[key]); delete pathTimers.current[key]; }
                    setPathLoading(false);
                    setPathError('failed');
                    return null;
                }

                if (data.status === 'generating') return null;

                if (pathTimers.current[key]) { clearInterval(pathTimers.current[key]); delete pathTimers.current[key]; }
                pathCache.current[key] = data;

                setRoadmap(prev => {
                    if (!prev) return prev;
                    const updated = {
                        ...prev,
                        paths: (prev.paths ?? []).map(p =>
                            p.id === pathId ? { ...p, ...data } : p
                        ),
                    };
                    cache.current[langName] = updated;
                    return updated;
                });

                setPathLoading(false);
                return data;
            } catch (err) {
                if (pathTimers.current[key]) { clearInterval(pathTimers.current[key]); delete pathTimers.current[key]; }
                setPathLoading(false);
                setPathError(err.message || "Failed to load path");
                return null;
            }
        };

        const result = await doFetch();
        if (!result && !pathTimers.current[key]) {
            pathTimers.current[key] = setInterval(doFetch, POLL_INTERVAL);
        }
        return result;
    }, []);

    return {
        roadmap, loading, error, fetchRoadmap, fetchPath, pathLoading, pathError,
        syncProgressToServer, flushSync, reloadProgress, progressVersion,
    };
}
