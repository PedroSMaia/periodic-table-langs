import { COLS } from "./constants.js";

/**
 * Returns the [row, col] position of a language in the periodic table grid.
 * The first 6 elements occupy fixed positions (like the real periodic table).
 * The rest fill in sequentially from row 3 onwards.
 *
 * @param {number} i - Zero-based index of the language in the LANGS array
 * @returns {[number, number]} - [row, col] both 1-based
 */
export function getPos(i) {
    // First 6 languages have hardcoded positions (top-left block)
    const fixed = [[1,1],[1,2],[1,17],[1,18],[2,1],[2,2]];
    if (i < 6) return fixed[i];

    // The rest fill the grid row by row starting at row 3, col 1
    const r = Math.floor((i - 6) / COLS) + 3;
    const c = ((i - 6) % COLS) + 1;
    return [r, c];
}