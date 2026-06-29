"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareStepKeywords = compareStepKeywords;
/**
 * Compares two step keywords based on length. Can be used with Array.sort to
 * sort keywords by length, descending.
 *
 * @param a - the first step keyword
 * @param b - the second step keyword
 */
function compareStepKeywords(a, b) {
    return b.length - a.length;
}
//# sourceMappingURL=compareStepKeywords.js.map