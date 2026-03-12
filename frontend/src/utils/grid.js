/**
 * Returns the [row, col] position of a language in the periodic table grid.
 *
 * The first 6 languages occupy fixed positions mirroring the real periodic table:
 * - i=0 → row 1, col 1           (top-left, like Hydrogen)
 * - i=1 → row 1, col cols        (top-right, like Helium)
 * - i=2 → row 2, col 1
 * - i=3 → row 2, col 2
 * - i=4 → row 2, col cols-1
 * - i=5 → row 2, col cols
 *
 * The rest fill the grid row by row starting at row 3, col 1.
 *
 * @param {number}  i           - Zero-based index of the language
 * @param {number}  cols        - Number of effective columns in the current grid
 * @param {boolean} simple      - If true (mobile), all cells fill sequentially from row 1
 * @returns {[number, number]}  - [row, col] both 1-based
 */
export function getPos(i, cols, simple) {
    if (simple) {
        return [Math.floor(i / cols) + 1, (i % cols) + 1];
    }
    if (i === 0) return [1, 1];
    if (i === 1) return [1, cols];
    if (i === 2) return [2, 1];
    if (i === 3) return [2, 2];
    if (i === 4) return [2, cols - 1];
    if (i === 5) return [2, cols];
    const r = Math.floor((i - 6) / cols) + 3;
    const c = ((i - 6) % cols) + 1;
    return [r, c];
}