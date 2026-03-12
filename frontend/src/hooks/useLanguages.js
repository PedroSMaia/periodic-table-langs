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
                const [langsRes, metricsRes] = await Promise.all([
                    fetch("/api/languages"),
                    fetch("/api/metrics"),
                ]);

                if (!langsRes.ok)   throw new Error(`Languages API error: HTTP ${langsRes.status}`);
                if (!metricsRes.ok) throw new Error(`Metrics API error: HTTP ${metricsRes.status}`);

                const [langsData, metricsData] = await Promise.all([
                    langsRes.json(),
                    metricsRes.json(),
                ]);

                if (!cancelled) {
                    setLangs(langsData);
                    setMetrics(metricsData);
                }
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