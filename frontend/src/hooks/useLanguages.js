import { useState, useEffect } from "react";

/**
 * Fetches all languages from the Laravel API.
 * Falls back to an empty array on error so the UI still renders.
 *
 * @returns {{ langs: object[], loading: boolean, error: string|null }}
 */
export function useLanguages() {
    const [langs,   setLangs]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchLangs() {
            try {
                const res = await fetch("/api/languages");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                if (!cancelled) setLangs(data);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchLangs();
        return () => { cancelled = true; };
    }, []);

    return { langs, loading, error };
}