import { useState, useCallback, useRef } from "react";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const POLL_INTERVAL = 4000; // 4s polling while generating

export function useRoadmap() {
    const [roadmap,     setRoadmap]     = useState(null);
    const [loading,     setLoading]     = useState(false);
    const [error,       setError]       = useState(null);
    const [pathLoading, setPathLoading] = useState(false);
    const [pathError,   setPathError]   = useState(null);

    const cache      = useRef({});
    const pathCache  = useRef({});
    const pollTimer  = useRef(null);
    const pathTimers = useRef({});

    const stopPolling = () => {
        if (pollTimer.current) { clearInterval(pollTimer.current); pollTimer.current = null; }
    };

    const fetchRoadmap = useCallback(async (langName) => {
        if (!langName) return;

        // Serve from memory cache immediately
        if (cache.current[langName]) {
            setRoadmap(cache.current[langName]);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);
        setRoadmap(null);
        stopPolling();

        const doFetch = async () => {
            try {
                const res = await fetch(`${BASE}/api/roadmap/${encodeURIComponent(langName)}`);
                if (!res.ok) throw new Error(`Server responded with ${res.status}`);
                const data = await res.json();

                if (data.status === 'failed') {
                    stopPolling();
                    setLoading(false);
                    setError('Failed to generate roadmap');
                    return;
                }

                if (data.status === 'generating') {
                    // Keep polling — don't stop loading
                    return;
                }

                // Ready
                stopPolling();
                cache.current[langName] = data;
                setRoadmap(data);
                setLoading(false);
            } catch (err) {
                stopPolling();
                setLoading(false);
                setError(err.message || "Failed to load roadmap");
            }
        };

        const initial = await doFetch();
        // Only start polling if still generating (no cache set yet)
        if (!cache.current[langName]) {
            pollTimer.current = setInterval(doFetch, POLL_INTERVAL);
        }
    }, []);

    const fetchPath = useCallback(async (langName, pathId) => {
        if (!langName || !pathId) return null;

        const key = `${langName}:${pathId}`;
        if (pathCache.current[key]) return pathCache.current[key];

        setPathLoading(true);
        setPathError(null);

        const doFetch = async () => {
            try {
                const res = await fetch(`${BASE}/api/roadmap/${encodeURIComponent(langName)}/path/${encodeURIComponent(pathId)}`);
                if (!res.ok) throw new Error(`Server responded with ${res.status}`);
                const data = await res.json();

                if (data.status === 'failed') {
                    if (pathTimers.current[key]) { clearInterval(pathTimers.current[key]); delete pathTimers.current[key]; }
                    setPathLoading(false);
                    setPathError('Failed to generate path');
                    return null;
                }

                if (data.status === 'generating') return null; // Keep polling

                // Ready
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
                    cache.current[langName] = updated; // keep cache in sync
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

    return { roadmap, loading, error, fetchRoadmap, fetchPath, pathLoading, pathError };
}