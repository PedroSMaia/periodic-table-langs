import { useState } from "react";

/**
 * A drop-in replacement for useState that persists the value in localStorage.
 * On page reload, the last saved value is restored instead of resetting to default.
 *
 * @param {string} key - The localStorage key to read/write
 * @param {*} defaultValue - Value to use if nothing is stored yet
 * @returns {[*, function]} - [currentValue, setter] just like useState
 */
export function useLocalStorage(key, defaultValue) {
    const [value, setValue] = useState(() => {
        try {
            // On mount, attempt to read the stored value from localStorage
            const stored = localStorage.getItem(key);
            // If a value exists, parse it from JSON; otherwise fall back to defaultValue
            return stored !== null ? JSON.parse(stored) : defaultValue;
        } catch {
            // If localStorage is unavailable (e.g. private mode), use the default
            return defaultValue;
        }
    });

    const set = (newValue) => {
        // Update React state so the component re-renders
        setValue(newValue);
        try {
            // Persist the new value to localStorage for future sessions
            localStorage.setItem(key, JSON.stringify(newValue));
        } catch {
            // Silently ignore write errors (e.g. storage quota exceeded)
        }
    };

    return [value, set];
}