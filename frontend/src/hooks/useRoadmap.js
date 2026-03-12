import { useState, useCallback, useRef } from "react";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

/**
 * Hook to fetch and cache roadmap data per language.
 *
 * Returns:
 *  - roadmap: the parsed roadmap object (null if not yet loaded)
 *  - loading: true while fetching
 *  - error: error message string or null
 *  - fetch: call with a language name to load its roadmap
 */
export function useRoadmap() {
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState(null);

    // In-memory cache so switching languages in the same session is instant
    const cache = useRef({});

    const fetchRoadmap = useCallback(async (langName) => {
        if (!langName) return;

        // Serve from cache if available
        if (cache.current[langName]) {
            setRoadmap(cache.current[langName]);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);
        setRoadmap(null);

        try {
            const res = await fetch(`${BASE}/api/roadmap/${encodeURIComponent(langName)}`);
            if (!res.ok) throw new Error(`Server responded with ${res.status}`);
            const data = await res.json();
            cache.current[langName] = data;
            setRoadmap(data);
        } catch (err) {
            setError(err.message || "Failed to load roadmap");
        } finally {
            setLoading(false);
        }
    }, []);

    return { roadmap, loading, error, fetchRoadmap };
}