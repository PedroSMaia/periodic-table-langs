import { useState, useEffect } from "react";

/**
 * Delays updating a value until the input has stopped changing for a given duration.
 * Useful for search inputs — avoids filtering on every single keystroke.
 *
 * Example: user types "Python" quickly → debounced value only updates once,
 * 300ms after the last keystroke, instead of on every letter.
 *
 * @param {*} value - The rapidly-changing value to debounce (e.g. search query)
 * @param {number} delay - Milliseconds to wait after the last change (default: 300)
 * @returns {*} - The debounced value, which updates only after the delay has elapsed
 */
export function useDebounce(value, delay = 300) {
    // Store the "settled" value that consumers actually use
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        // Start a timer to update the debounced value after the delay
        const timer = setTimeout(() => setDebounced(value), delay);

        // If the value changes again before the timer fires, cancel the previous timer
        // and start a new one — this is the core of the debounce mechanism
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}