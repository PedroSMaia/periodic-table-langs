import { useState, useEffect } from "react";

/**
 * Fetches languages and metrics from the Laravel API in parallel.
 * Falls back to empty values on error so the UI still renders.
 *
 * @returns {{ langs: object[], metrics: object, loading: boolean, error: string|null }}
 */
export function useLanguages() {
    const [langs,   setLangs]   = useState([]);
    const [metrics, setMetrics] = useState({ tiobe: {}, so_loved: {}, so_used: {}, ratings: {} });
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchAll() {
            try {
                const langsRes = await fetch("/api/languages");
                if (!langsRes.ok) throw new Error(`Languages API error: HTTP ${langsRes.status}`);
                const langsData = await langsRes.json();
                if (!cancelled) setLangs(langsData);

                // Metrics are optional — don't block the UI if they fail
                try {
                    const metricsRes = await fetch("/api/metrics");
                    if (metricsRes.ok) {
                        const metricsData = await metricsRes.json();
                        if (!cancelled) setMetrics(metricsData);
                    }
                } catch { /* metrics unavailable, keep defaults */ }
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchAll();
        return () => { cancelled = true; };
    }, []);

    return { langs, metrics, loading, error };
}